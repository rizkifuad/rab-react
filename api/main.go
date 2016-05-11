package main

import (
	"log"
	"net/http"
	"regexp"
	"rizki/rab/api/model"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	model.Migrate()

	user := model.User{}
	barang := model.Barang{}
	supplier := model.Supplier{}
	anggaran := model.Anggaran{}
	projectOrder := model.ProjectOrder{}

	r := mux.NewRouter()
	//r.HandleFunc("/auth", auth)
	r.HandleFunc("/checkToken", user.CheckToken).Methods("POST")
	r.HandleFunc("/auth", user.Validate).Methods("POST")

	rAuth := r.PathPrefix("/api").Subrouter()

	rAuth.HandleFunc("/user", user.List)
	rAuth.HandleFunc("/user/prepareUpgrade", user.PrepareCreate)
	rAuth.HandleFunc("/user/prepareUpgrade/{id:[0-9]+}", user.PrepareUpdate)
	rAuth.HandleFunc("/user/save", user.Update).Methods("PUT")
	rAuth.HandleFunc("/user/save", user.Create).Methods("POST")

	rAuth.HandleFunc("/barang", barang.List)
	rAuth.HandleFunc("/barang/prepareUpgrade/{id:[0-9]+}", barang.PrepareUpdate)
	rAuth.HandleFunc("/barang/save", barang.Update).Methods("PUT")
	rAuth.HandleFunc("/barang/save", barang.Create).Methods("POST")

	rAuth.HandleFunc("/supplier", supplier.List)
	rAuth.HandleFunc("/supplier/prepareUpgrade/{id:[0-9]+}", supplier.PrepareUpdate)
	rAuth.HandleFunc("/supplier/save", supplier.Update).Methods("PUT")
	rAuth.HandleFunc("/supplier/save", supplier.Create).Methods("POST")

	rAuth.HandleFunc("/anggaran", anggaran.List)
	rAuth.HandleFunc("/anggaran/prepareUpgrade", anggaran.PrepareCreate)
	rAuth.HandleFunc("/anggaran/prepareUpgrade/{id:[0-9]+}", anggaran.PrepareUpdate)
	rAuth.HandleFunc("/anggaran/save", anggaran.Update).Methods("PUT")
	rAuth.HandleFunc("/anggaran/save", anggaran.Create).Methods("POST")

	rAuth.HandleFunc("/project_order/{id:[0-9]+}", projectOrder.List)
	rAuth.HandleFunc("/project_order/prepareUpgrade", projectOrder.PrepareCreate)
	rAuth.HandleFunc("/project_order/prepareUpgrade/{id:[0-9]+}", projectOrder.PrepareUpdate)
	rAuth.HandleFunc("/project_order/check/{id:[0-9]+}/{barangId:[0-9]+}/{jumlah:[0-9]+}", projectOrder.Check)
	rAuth.HandleFunc("/project_order/save", projectOrder.Create).Methods("POST")
	rAuth.HandleFunc("/project_order/approve/{id:[0-9]+}", projectOrder.Approve).Methods("GET")
	rAuth.HandleFunc("/project_order/tolak/{id:[0-9]+}", projectOrder.Tolak).Methods("GET")
	rAuth.HandleFunc("/project_order/cetak/{id:[0-9]+}", projectOrder.CetakOrder).Methods("GET")

	//r.Handle("/api", Middleware(rAuth))
	http.Handle("/", (Middleware(r)))
	println("Listen and serve at port 7000")
	log.Fatal(http.ListenAndServe(":7000", nil))
}

func Middleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		matched, _ := regexp.MatchString("/api/.*", r.URL.String())
		if matched {
			log.Println("middleware", r.URL)
			t := r.Header.Get("Authorization")

			user := model.User{}
			validToken := user.ValidateToken(string(t))
			if validToken {
				h.ServeHTTP(w, r)
			} else {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write(model.ParseJSON(model.APIMessage{
					Error:   true,
					Message: "Token expired",
				}))
			}

		} else {
			h.ServeHTTP(w, r)
		}
	})
}
