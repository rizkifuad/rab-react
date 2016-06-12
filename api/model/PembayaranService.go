package model

import (
	"encoding/json"
	"fmt"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"strings"

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
	var supplier Supplier

	anggaran.GetByID(id)
	var result struct {
		Detail   []PembayaranDetail
		Anggaran Anggaran
		Supplier []Supplier
	}
	detail := pembayaran.GetByID(id, cetak)
	result.Detail = detail
	result.Anggaran = anggaran
	result.Supplier = supplier.GetSuppliers()

	w.Write(ParseJSON(result))
}

func (pembayaran *Pembayaran) List(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	pembayarans := pembayaran.GetPembayarans(id)
	w.Write(ParseJSON(pembayarans))
}

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randSeq(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func (pembayaran *Pembayaran) Upload(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)
	file, handler, err := r.FormFile("file")
	cetak := r.FormValue("cetak")
	anggaranId := r.FormValue("anggaran_id")
	//cetak, handler, err := r.FormFile("cetak")
	//anggaranId, handler, err := r.FormFile("anggaran_id")
	println(cetak)
	println(anggaranId)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
	filename := randSeq(5)
	ext := filepath.Ext(handler.Filename)
	println(filename)
	f, err := os.OpenFile("./image/"+filename+ext, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}

	db.Exec("UPDATE pembayaran SET gambar=? WHERE anggaran_id=? and cetak=?", filename+ext, anggaranId, cetak)

	defer f.Close()
	io.Copy(f, file)
}
func (pembayaran *Pembayaran) GambarServe(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	gambar, _ := vars["gambar"]
	ext := strings.Replace(filepath.Ext(gambar), ".", "", -1)
	f, err := os.Open("./image/" + gambar)
	defer f.Close()
	if err != nil {
		log.Fatal(err)
	}
	println(ext)
	w.Header().Set("Content-Type", "image/"+ext)
	str, _ := ioutil.ReadAll(f)
	//output, _ := base64.StdEncoding.DecodeString(string(f))
	io.WriteString(w, string(str))

}
