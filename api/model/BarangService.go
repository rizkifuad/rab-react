package model

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (barang *Barang) Update(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input BarangInput
	_ = decoder.Decode(&input)

	barang, result := input.ValidateInput("UPDATE")

	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Table("barang").Where("id = ?", input.ID).Update(barang)

	w.Write(ParseJSON(result))

}

func (barang *Barang) Create(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input BarangInput
	_ = decoder.Decode(&input)

	barang, result := input.ValidateInput("CREATE")
	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Create(&barang)
	w.Write(ParseJSON(result))
}

func (barang *Barang) PrepareUpdate(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	barang.ID = uint(id)

	barang.GetByID(id)
	result := *barang

	w.Write(ParseJSON(result))
}

func (barang *Barang) List(w http.ResponseWriter, r *http.Request) {
	barangs := barang.GetBarangs()
	w.Write(ParseJSON(barangs))
}
