package model

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (order *ProjectOrder) Update(w http.ResponseWriter, r *http.Request) {
	//db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input ProjectOrderInput
	_ = decoder.Decode(&input)

	order, result := input.ValidateInput("UPDATE")

	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	//db.Table("project_order").Where("id = ?", input.ID).Update(order)

	w.Write(ParseJSON(result))

}

func (order *ProjectOrder) Create(w http.ResponseWriter, r *http.Request) {
	println("Save")
	db := initDb()
	decoder := json.NewDecoder(r.Body)
	fmt.Printf("%v", r.Body)

	var input ProjectOrderInput
	_ = decoder.Decode(&input)

	fmt.Printf("%+v", input)

	order, result := input.ValidateInput("CREATE")
	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Create(&order)
	w.Write(ParseJSON(result))
}

func (order *ProjectOrder) PrepareCreate(w http.ResponseWriter, r *http.Request) {

	var result struct {
		Barangs []Barang
	}

	var b Barang

	result.Barangs = b.GetBarangs()

	w.Write(ParseJSON(result))
}

func (order *ProjectOrder) PrepareUpdate(w http.ResponseWriter, r *http.Request) {
	println("menggila")

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	order.ID = uint(id)

	order.GetByID(id)

	var result struct {
		Anggaran Anggaran
		Order    []ProjectOrder
		Barangs  []BarangAnggaran
	}

	var anggaran Anggaran
	anggaran.GetByID(id)

	result.Order = order.GetOrders(id)
	result.Anggaran = anggaran
	result.Barangs = anggaran.GetBarang(id)

	w.Write(ParseJSON(result))
}

func (order *ProjectOrder) List(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	orders := order.GetOrders(id)
	w.Write(ParseJSON(orders))
}
