package model

import (
	"encoding/json"
	"fmt"
	"log"
	"regexp"
	"rizki/rab/api/config"
	"strings"

	"github.com/jinzhu/gorm"
)

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
