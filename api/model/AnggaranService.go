package model

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (anggaran *Anggaran) Update(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input AnggaranInput
	_ = decoder.Decode(&input)

	anggaran, result := input.ValidateInput("UPDATE")

	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	var items []AnggaranDetail

	for i, _ := range input.Barang {
		BarangId, _ := strconv.Atoi(input.Barang[i])
		AnggaranId, _ := strconv.Atoi(input.ID)
		Jumlah, _ := strconv.Atoi(input.Jumlah[i])

		println("barang")
		println(input.Barang[i])
		println("jumlah")
		println(input.Jumlah[i])
		var item = AnggaranDetail{
			BarangId:   uint(BarangId),
			Jumlah:     Jumlah,
			AnggaranId: uint(AnggaranId),
		}

		items = append(items, item)

	}

	db.Table("anggaran").Where("id = ?", input.ID).Update(anggaran)
	anggaran.UpdateDetails(input.ID, items)

	w.Write(ParseJSON(result))

}

func (anggaran *Anggaran) Create(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input AnggaranInput
	_ = decoder.Decode(&input)

	anggaran, result := input.ValidateInput("CREATE")
	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Create(&anggaran)
	var items []AnggaranDetail
	for i, _ := range input.Barang {
		BarangId, _ := strconv.Atoi(input.Barang[i])
		AnggaranId := anggaran.ID
		Jumlah, _ := strconv.Atoi(input.Jumlah[i])

		println("barang")
		println(input.Barang[i])
		println("jumlah")
		println(input.Jumlah[i])
		var item = AnggaranDetail{
			BarangId:   uint(BarangId),
			Jumlah:     Jumlah,
			AnggaranId: uint(AnggaranId),
		}

		items = append(items, item)

	}
	anggaran.UpdateDetails(string(anggaran.ID), items)
	w.Write(ParseJSON(result))
}

func (anggaran *Anggaran) PrepareCreate(w http.ResponseWriter, r *http.Request) {

	var result struct {
		Barangs []Barang
	}

	var b Barang

	result.Barangs = b.GetBarangs()

	w.Write(ParseJSON(result))
}

func (anggaran *Anggaran) PrepareUpdate(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	anggaran.ID = uint(id)

	anggaran.GetByID(id)

	var result struct {
		Anggaran Anggaran
		Barangs  []Barang
		Items    []AnggaranDetail
	}

	var b Barang

	result.Anggaran = *anggaran
	result.Barangs = b.GetBarangs()
	result.Items = anggaran.GetDetails(id)

	w.Write(ParseJSON(result))
}

func (anggaran *Anggaran) List(w http.ResponseWriter, r *http.Request) {
	anggarans := anggaran.GetAnggarans()
	w.Write(ParseJSON(anggarans))
}
