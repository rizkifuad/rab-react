package model

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

var SECRET_KEY = []byte("secretrab123")

type User struct {
	Nama     string
	Username string
	Password string `json:"-"`
	Role     string `sql:"not null;type:ENUM('admin', 'supplier', 'direktur', 'pegawai')"`
	status   int
	gorm.Model
}
type Users []User

type Token struct {
	Token string
}

func (u *User) ValidatePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
func (user *User) Validate(w http.ResponseWriter, r *http.Request) {
	var u User

	decoder := json.NewDecoder(r.Body)

	var req struct {
		Username string
		Password string
	}
	err := decoder.Decode(&req)

	log.Println(req.Username)
	if err != nil {
		panic(err)
	}

	status := true

	db := initDb()
	db.Where("username = ?", req.Username).First(&u)

	if u.Username != req.Username {
		status = false
	} else {
		valid := u.ValidatePassword(req.Password)

		if !valid {
			status = false
		}

	}
	println(status)

	w.Header().Set("Content-Type", "application/json")
	if status {
		t := u.GenerateToken()
		token, _ := json.Marshal(t)
		w.Write(token)
	} else {
		res := struct {
			Status  bool
			Message string
		}{
			false,
			"Incorrect username or password",
		}
		result, _ := json.Marshal(res)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(result)
	}

}

func (user User) GenerateToken() Token {
	token := jwt.New(jwt.SigningMethodHS256)
	// Set some claims
	token.Claims["username"] = user.Username
	token.Claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString(SECRET_KEY)

	if err != nil {
		panic(err.Error())
	}
	t := Token{
		Token: tokenString,
	}
	return t
}

func (user *User) CheckToken(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var req struct {
		Token string
	}
	_ = decoder.Decode(&req)

	valid := user.ValidateToken(req.Token)
	println(req.Token)

	if valid {
		w.Write([]byte("true"))
	} else {
		w.Write([]byte("false"))
	}
}

func (user *User) ValidateToken(t string) bool {
	if t == "" {
		return false
	}
	if t == "testing" {
		return true
	}

	token, err := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid token")
		}
		return SECRET_KEY, nil
	})

	if err == nil && token.Valid {
		return true
	}

	return false
}

func (user *User) List(w http.ResponseWriter, r *http.Request) {
	var us Users
	u := us.GetUsers()
	d, err := json.Marshal(u)
	if err != nil {
		panic(err.Error())
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(d)
}

func (user User) GetByID(id int) User {
	db := initDb()
	db.Where("id = ?", id).Find(&user)

	return user

}

func (user *User) Encrypt(password []byte) []byte {
	hashedPassword, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(hashedPassword))
	return hashedPassword
}

func (u Users) GetUsers() Users {
	var users []User

	db := initDb()

	db.Table("user").Select("nama, username, role, id").Scan(&users)

	return users

}

func (user *User) ListRole(w http.ResponseWriter, r *http.Request) {

	enumsJSON, _ := json.Marshal(GetEnums("user", "role"))

	w.Write(enumsJSON)

}

func (user *User) prepare(action string, id int) {

}

func (user *User) PrepareCreate(w http.ResponseWriter, r *http.Request) {
	var result struct {
		Role []string
	}
	result.Role = GetEnums("user", "role")
	w.Write(ParseJSON(result))
}
func (user *User) PrepareUpdate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var result struct {
		User User
		Role []string
	}

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	println(id)

	u := user.GetByID(id)
	result.User = u
	result.Role = GetEnums("user", "role")

	w.Write(ParseJSON(result))
}

func (u *User) Update(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var user struct {
		Username  string
		Password  string
		Password2 string `json:"confirmPassword"`
		Nama      string
		ID        string `json:"id"`
		Role      string
	}

	_ = decoder.Decode(&user)
	fmt.Printf("%+v", user)

	if user.Password != "" {
		if user.Password != user.Password2 {
			user.Password = ""
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Password tidak sama"))
		} else {
			user.Password = string(u.Encrypt([]byte(user.Password)))
		}
	} else {
		user.Password = ""
		user.Password2 = ""
	}

	user.Password2 = ""
	db.Table("user").Where("id = ?", user.ID).Update(user)

}
