package model

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"rizki/rab/api/config"
	"strings"

	"github.com/jinzhu/gorm"
)

var db *gorm.DB

func Init() {
	db = initDb()
}

func initDb() *gorm.DB {
	db, err := gorm.Open(config.DRIVER, config.CONN)
	if err != nil {
		panic(err.Error())

	}
	db.SingularTable(true)
	db.LogMode(true)
	return db
}

func GetEnums(table string, field string) []string {

	var Enums struct {
		Field string `gorm:"column:Field"`
		Type  string `gorm:"column:Type"`
	}

	db := initDb()
	query := fmt.Sprintf("SHOW COLUMNS FROM %s WHERE Field = \"%s\"", table, field)
	db.Raw(query).Scan(&Enums)
	regex, _ := regexp.Compile("\\(.*\\)")
	fieldType := regex.FindString(Enums.Type)
	fieldType = strings.Replace(fieldType, "(", "", -1)
	fieldType = strings.Replace(fieldType, ")", "", -1)
	fieldType = strings.Replace(fieldType, "'", "", -1)

	return strings.Split(fieldType, ",")

}

func ParseJSON(data interface{}) []byte {
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Println(err.Error())
	}

	return jsonData
}

type APIMessage struct {
	Error   bool
	Message string
}

type Service interface {
	List(w http.ResponseWriter, r *http.Request)
	PrepareCreate(w http.ResponseWriter, r *http.Request)
	PrepareUpdate(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
}
