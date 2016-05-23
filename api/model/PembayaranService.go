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
	cetak, _ := strconv.Atoi(vars["cetak"])
	pembayaran.ID = uint(id)
	var anggaran Anggaran
	anggaran.GetByID(id)
	var result struct {
		Detail   []PembayaranDetail
		Anggaran Anggaran
	}
	detail := pembayaran.GetByID(id, cetak)
	result.Detail = detail
	result.Anggaran = anggaran

	w.Write(ParseJSON(result))
}

func (pembayaran *Pembayaran) List(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	pembayarans := pembayaran.GetPembayarans(id)
	w.Write(ParseJSON(pembayarans))
}
