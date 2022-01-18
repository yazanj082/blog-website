const got = require('got');

//using openweather api to get the rate between gold and bitcoin
module.exports = {
    getCoin: async () => {
        try{
            const url = `https://rest.coinapi.io/v1/exchangerate/BTC?apikey=50B5C12C-6DCF-45F3-822D-EBF9682FA232`;

            const response = await got(url);
        
            const data = JSON.parse(response.body);
        
            return data.rates[3];

        }catch(err){

            console.log(err);

        }
    }
}