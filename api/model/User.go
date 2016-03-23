package model

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

var SECRET_KEY = []byte("secretrab123")

type Role struct {
	RoleName string
	gorm.Model
}

type User struct {
	Nama     string
	Username string
	Password string
	Role     Role
	RoleID   uint
	status   int
	gorm.Model
}
type Users []User

type Token struct {
	Token string
	User  User
}

func (u *User) Find(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var user User
	id, _ := strconv.Atoi(vars["id"])
	user.GetByID(id)
	data, err := json.Marshal(user)
	if err != nil {
		panic(err.Error())
	}

	w.Write(data)
}

func (u *User) ValidatePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
func (u *User) Validate(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	status := true

	db := initDb()
	db.Where("username = ?", username).First(&u)
	db.Model(&u).Related(&u.Role)
	if u == nil {
		status = false
	}
	valid := u.ValidatePassword(password)

	if !valid {
		status = false
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
		User:  user,
	}
	return t
}

func (user *User) CheckToken(w http.ResponseWriter, r *http.Request) {
	t := r.FormValue("token")
	token, err := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["secret"])
		}
		return SECRET_KEY, nil
	})

	if err == nil && token.Valid {
		w.Write([]byte("true"))
	} else {
		w.Write([]byte("false"))
	}
}

func (user *User) List(w http.ResponseWriter, r *http.Request) {
	var u Users
	u = u.GetAll()
	d, err := json.Marshal(u)
	if err != nil {
		panic(err.Error())
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(d)
}

func (user *User) GetByID(id int) {
	db := initDb()
	db.Where("id = ?", id).Find(&user)
	db.Model(&user).Related(user.Role)

}

func (user *User) Encrypt(password []byte) []byte {
	hashedPassword, err := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(hashedPassword))
	return hashedPassword
}

type Usermap struct {
	User
	Role
}
type Usermaps []Usermap

func (u Users) GetAll() Users {
	var users []Usermap

	db := initDb()

	db.Table("user").Select("*").Joins("JOIN role ON user.role_id = role.id").Scan(&users)

	u = make(Users, len(users))
	for i, v := range users {
		u[i] = v.User
		u[i].Role = v.Role
	}

	return u

}
