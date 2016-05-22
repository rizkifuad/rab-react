package model

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (pembayaran *Pembayaran) Update(w http.ResponseWriter, r *http.Request) {
	//db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input PembayaranInput
	_ = decoder.Decode(&input)

	pembayaran, result := input.ValidateInput("UPDATE")

	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Table("pembayaran").Where("id = ?", input.ID).Update(pembayaran)

	w.Write(ParseJSON(result))

}

func (pembayaran *Pembayaran) Create(w http.ResponseWriter, r *http.Request) {
	//db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input PembayaranInput
	_ = decoder.Decode(&input)

	pembayaran, result := input.ValidateInput("CREATE")
	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Create(&pembayaran)
	w.Write(ParseJSON(result))
}

func (pembayaran *Pembayaran) PrepareUpdate(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	pembayaran.ID = uint(id)

	pembayaran.GetByID(id, 1)
	result := *pembayaran

	w.Write(ParseJSON(result))
}

func (pembayaran *Pembayaran) List(w http.ResponseWriter, r *http.Request) {
	pembayarans := pembayaran.GetPembayarans()
	w.Write(ParseJSON(pembayarans))
}
