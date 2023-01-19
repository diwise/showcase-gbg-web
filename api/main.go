package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/alexandrevicenzi/go-sse"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

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
	r.Handle("/*", http.FileServer(http.Dir(webRoot)))
	r.Mount("/events/", s)
	r.Post("/v2/notify", notifyHandlerFunc(s))

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

func notificationReceived(ctx context.Context, s *sse.Server, n Notification) error {
	for _, e := range n.Entities {
		b, err := e.MarshalJSON()
		if err != nil {
			return err
		}

		s.SendMessage("/events/channel-1", sse.SimpleMessage(string(b)))
	}

	return nil
}
