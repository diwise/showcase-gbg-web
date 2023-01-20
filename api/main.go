package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/alexandrevicenzi/go-sse"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Entity struct {
	Id   string `json:"id"`
	Type string `json:"type"`
}

type Notification struct {
	Entity
	SubscriptionId string            `json:"subscriptionId"`
	NotifiedAt     string            `json:"notifiedAt"`
	Entities       []json.RawMessage `json:"data"`
}

type Store struct {
	mu       sync.Mutex
	messages []json.RawMessage
}

func (s *Store) Add(m json.RawMessage) {
	s.mu.Lock()
	s.messages = append(s.messages, m)
	s.mu.Unlock()
}

func (s *Store) Get() ([]byte, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	m, err := json.Marshal(s.messages)
	if err != nil {
		return nil, err
	}

	return m, nil
}

var store Store = Store{messages: make([]json.RawMessage, 0)}

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	s := sse.NewServer(nil)
	defer s.Shutdown()

	webRoot := os.Getenv("WEB_ROOT")
	log.Println("web root:", webRoot)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	r.Get("/messages", func(w http.ResponseWriter, r *http.Request) {
		m, err := store.Get()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Write(m)
		w.WriteHeader(http.StatusOK)
	})

	r.Handle("/*", http.FileServer(http.Dir(webRoot)))
	r.Mount("/events/", s)
	r.Post("/v2/notify", notifyHandlerFunc(s))

	go func() {
		for {
			s.SendMessage("/events/channel-1", sse.NewMessage(fmt.Sprint(time.Now().Unix()), "{}", "keep-alive"))
			time.Sleep(10 * time.Second)
		}
	}()

	http.ListenAndServe(":8080", r)
}

func notifyHandlerFunc(s *sse.Server) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var err error

		body, err := io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		n := Notification{}
		err = json.Unmarshal(body, &n)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		err = notificationReceived(r.Context(), s, n)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		} else {
			w.WriteHeader(http.StatusOK)
		}
	})
}

func notificationReceived(ctx context.Context, s *sse.Server, n Notification) error {
	for _, e := range n.Entities {
		var entity Entity
		err := json.Unmarshal(e, &entity)
		if err != nil {
			return err
		}

		b, err := e.MarshalJSON()
		if err != nil {
			return err
		}

		message := sse.NewMessage(fmt.Sprint(time.Now().Unix()), string(b), entity.Type)
		s.SendMessage("/events/channel-1", message)
		
		store.Add(e)
	}

	return nil
}
