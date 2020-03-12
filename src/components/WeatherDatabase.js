import React from 'react';
import * as SQLite from 'expo-sqlite';

 class WeatherDatabase extends React.Component {
   constructor(filename) {
     super();
     this.db = SQLite.openDatabase(filename);
     this.doesDbExist;
   }

   getDb = () => {
     return this.db;
   }

   dbExists = () => {
     return new Promise((resolve, reject) => {
       this.db.transaction(txn => {
         txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Weather'", [], (tx, res) => {
           resolve(res.rows._array.length)
         })
       });
     })
   }

   setDbExists = async (val) => {
     if(val) {
       this.doesDbExist = true;
     } else {
       this.doesDbExist = false;
     }
   }

   getDbExists = () => {
     return this.doesDbExist;
   }

   createWeatherTable = (places) => {
     return new Promise((resolve, reject) => {
       this.db.transaction(txn => {
         txn.executeSql('DROP TABLE IF EXISTS Weather', []);
         txn.executeSql('CREATE TABLE IF NOT EXISTS Weather(city_id INTEGER PRIMARY KEY NOT NULL, city VARCHAR(30), weather VARCHAR(70000), coordinates VARCHAR(50), id VARCHAR(8))', []);
        });
        places.map(place => {
          this.db.transaction(txn => {
            txn.executeSql('INSERT INTO Weather (id, city, weather, coordinates) VALUES (?, ?, ?, ?)', [place.id, place.city, JSON.stringify(place.weather), JSON.stringify(place.coordinates)], (tx, res) => {
              console.log(res.insertId, places.length)
              if (res.insertId == places.length) {
                resolve(res)
              }
            });
          });
        });
      })
   };

   createRoutesTable = (route) => {
     //console.log(route)
     this.db.transaction(txn => {
       txn.executeSql('DROP TABLE IF EXISTS Routes', []);
       txn.executeSql('CREATE TABLE IF NOT EXISTS Routes(route_id INTEGER PRIMARY KEY NOT NULL, latlngs VARCHAR(1024), departure_location VARCHAR(16), destination_location VARCHAR(16))', []);
       txn.executeSql('INSERT INTO Routes (latlngs, departure_location, destination_location) VALUES (?, ?, ?)', [JSON.stringify(route.latlngs), route.departure_location, route.destination_location], (succ) => {
         if (succ) {
          console.log('success');
         } else {
          console.log(succ);
         }
       });
     });
   };

   getRouteLatLngs = () => {
     return new Promise((resolve, reject) => {
       this.db.transaction(txn => {
         txn.executeSql("SELECT latlngs FROM Routes ", [], (tx, res) => {
           resolve(res.rows._array)
         });
       });
     });
   };

   getCityNamesAndCoordinates = () => {
     return new Promise((resolve, reject) => {
       this.db.transaction(txn => {
         txn.executeSql("SELECT city_id, city, coordinates, id FROM WEATHER ", [], (tx, res) => {
           resolve(res.rows._array)
         });
       });
     });
   };

   getLocationDailyWeatherForecast = (city_id) => {
     return new Promise((resolve, reject) => {
       this.db.transaction(txn => {
         txn.executeSql("SELECT weather FROM WEATHER WHERE city_id='"+city_id+"'", [], (tx, res) => {
           resolve(res.rows._array)
         });
       });
     });
   };

   printRouteTable = () => {
     this.db.transaction(txn => {
       txn.executeSql('SELECT * FROM Routes', [], (tx, res) => {
         console.log(res);
       })
     })
   }

   printTable = () => {
     return new Promise((resolve, reject) => {
       this.db.transaction(txn => {
         txn.executeSql('SELECT COUNT(*) FROM Weather', [], (tx, res) => {
           resolve(Object.values(res.rows._array[0])[0]);
         })
       })
     })
   }
};

export default WeatherDatabase;
