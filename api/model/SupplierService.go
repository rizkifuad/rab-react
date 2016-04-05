package model

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (supplier *Supplier) Update(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input SupplierInput
	_ = decoder.Decode(&input)

	supplier, result := input.ValidateInput("UPDATE")

	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Table("supplier").Where("id = ?", input.ID).Update(supplier)

	w.Write(ParseJSON(result))

}

func (supplier *Supplier) Create(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input SupplierInput
	_ = decoder.Decode(&input)

	supplier, result := input.ValidateInput("CREATE")
	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Create(&supplier)
	w.Write(ParseJSON(result))
}

func (supplier *Supplier) PrepareUpdate(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	supplier.ID = uint(id)

	supplier.GetByID(id)
	result := *supplier

	w.Write(ParseJSON(result))
}

func (supplier *Supplier) List(w http.ResponseWriter, r *http.Request) {
	suppliers := supplier.GetSuppliers()
	w.Write(ParseJSON(suppliers))
}
