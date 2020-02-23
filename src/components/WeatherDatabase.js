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
         txn.executeSql('SELECT COUNT(*) FROM Weather', [], (tx, res) => {
           resolve(Object.values(res.rows._array[0])[0])
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
     const city = places[0].city
     this.db.transaction(txn => {
       txn.executeSql('DROP TABLE IF EXISTS Weather', []);
       txn.executeSql('CREATE TABLE IF NOT EXISTS Weather(city_id INTEGER PRIMARY KEY NOT NULL, city VARCHAR(30), weather VARCHAR(70000))', []);
       txn.executeSql('INSERT INTO Weather (city, weather) VALUES (?, ?)', [city, JSON.stringify(places[0].weather)], (succ) => {
         if (succ) {
          console.log('success');
        } else {
          console.log(succ);
        }
       });
      });
      places.slice(1,).map(place => {
        this.db.transaction(txn => {
          txn.executeSql('INSERT INTO Weather (city, weather) VALUES (?, ?)', [place.city, JSON.stringify(place.weather)], (succ) => {
            if (succ) {
             console.log('success');
           } else {
             console.log(succ);
           }
          });
        });
      });
   };

   printTable = () => {
     this.db.transaction(txn => {
       txn.executeSql('SELECT * FROM Weather', [], (tx, res) => {
         console.log(res);
       })
     })
   }

};

export default WeatherDatabase;
