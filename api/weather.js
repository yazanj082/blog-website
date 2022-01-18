const got = require('got');

//using openweather api to get the weather of the required city and exported the function to be used in other files
module.exports = {
    getWeather: async (cityName) => {
        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a788c7582fb08a21a8df4be8a13b76be&units=metric`;

            const response = await got(url);
        
            const data = JSON.parse(response.body);
        
            return data.main.temp;

        }catch(err){

            console.log(err);

        }
    }
}