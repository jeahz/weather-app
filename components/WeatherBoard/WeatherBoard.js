import React, { Component, createRef } from 'react';
import styles from "./WeatherBoard.module.scss";

export const credit_org = "Open Weather";
export const credit_link = "https://openweathermap.org/";

export default class WeatherBoard extends Component {
  constructor(props) {
    super(props)

    this.cityRef = createRef();

    const { data } = this.props;
    const {
      weather,
      name: city,
      sys: {
        country
      }
    } = data;
    const { main, description, icon } = weather[0];
    this.state = {
      location: {
        city,
        country
      },
      weather: {
        main,
        description,
        icon
      },
      isCityInvalid: false,
      errorMessage: null,
      successMessage: null
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const city = this.cityRef.current.value;
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`)
      .then(res => res.json())
      .then(data => {
        console.log('data', data);
        const { cod } = data;
        if (cod === 200) {
          const {
            weather,
            name: city,
            sys: {
              country
            }
          } = data;
          const { main, description, icon } = weather[0];
          this.setState({
            location: {
              city,
              country
            },
            weather: {
              main,
              description,
              icon
            },
            successMessage: "Weather has been successfully fetched.", 
            errorMessage: null, 
            isCityValid: true, 
            isCityInvalid: false
          });
        } else if (cod !== 200) {
          const { message } = data;
          this.setState({
            isCityValid: false,
            isCityInvalid: true,
            successMessage: null,
            errorMessage: message
          })
        }
      })
  }

  convertCountryIDToName(countryID) {
    let countries = new Intl.DisplayNames(['en'], { type: 'region' });
    const country = countries.of(countryID);
    return country;
  }

  renderLocation() {
    const {
      location: {
        city,
        country: countryID
      }
    } = this.state;
    const country = this.convertCountryIDToName(countryID);

    return (
      <div className="location-name">{city}, {country}</div>
    )
  }

  renderWeather() {
    const {
      weather: {
        main,
        description,
        icon
      }
    } = this.state;
    return (
      <>
        <div className="weather-title">{main}</div>
        <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} className="weather-image"></img>
        <p>{description}</p>
      </>
    )
  }

  renderWeatherForm() {
    const { isCityValid, isCityInvalid, successMessage, errorMessage } = this.state;

    return (
    <form className={styles.weather_form} onSubmit={(e) => this.handleSubmit(e)}>
      <div className={`
      ${styles.message} 
      ${styles.show} 
      ${isCityValid && styles.isSuccess}
      ${isCityInvalid && styles.isError}`}>
        {successMessage || errorMessage || "Please input the city below."}
      </div>
      <input className={
        `${styles.weather_input} ${isCityInvalid && styles.isInvalid}`
      } type="text" placeholder="City" ref={this.cityRef} />
      <button className={styles.submit_button} type="submit">Submit</button>
    </form>
    );
  }

  renderCredit() {
    return (
      <div className={styles.weather_credit}>
        Data is provided by&nbsp;
        <a className={styles.credit_link} href={credit_link}>
          {credit_org}
        </a>
      </div>
    )
  }

  render() {
    return (
      <>
        <div className={styles.weather_board_container}>
          <div className={styles.weather_board}>
            <h1 className={styles.title}>Weather Board</h1>
            {this.renderWeather()}
            {this.renderLocation()}
          </div>
          {this.renderWeatherForm()}
          {this.renderCredit()}
        </div>
      </>
    );
  }
}
