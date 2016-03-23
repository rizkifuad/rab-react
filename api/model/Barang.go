package model

import (
	"encoding/json"
	"net/http"

	"github.com/jinzhu/gorm"
)

type Barang struct {
	NamaBarang string
	Satuan     string
	gorm.Model
}

type Supplier struct {
	NamaSuplier string
	Alamat      string
	gorm.Model
}

func (barang *Barang) List(w http.ResponseWriter, r *http.Request) {
	var b Barang
	barangs := b.GetAll()
	d, _ := json.Marshal(barangs)
	w.Header().Set("Content-Type", "application/json")
	w.Write(d)
}
func (b Barang) GetAll() []Barang {

	db := initDb()
	var barangs []Barang

	db.Table("barang").Select("*").Find(&barangs)
	return barangs
}
