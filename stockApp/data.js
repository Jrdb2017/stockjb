 const loadStockData = (symbol) => fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+symbol+"&apikey=V8FX6NG9HB7W35GK").then(d=>dailyJson=d.json()).then(
    j=>{
        var priceData = [];
        for(var i = 0; i< Object.keys(j["Time Series (Daily)"]).length;i++)
        {
          var date = Object.keys(j["Time Series (Daily)"])[i];
          var data = j["Time Series (Daily)"][date]["4. close"];
            priceData.push({date:date,value:parseFloat(data)});
 
        }

        return priceData;
    }
    
);
 const loadStochasticData = (symbol) => fetch("https://www.alphavantage.co/query?function=STOCH&symbol="+symbol+"&interval=daily&apikey=V8FX6NG9HB7W35GK").then(d=>dailyJson=d.json()).then(
        j=>{
            var stochData = [];
            var dateOfInterest = new Date();
            for(var i = 0; i<100;i++)
            {
                
                
                var formattedDate = dateOfInterest.getFullYear() + "-"+(dateOfInterest.getUTCMonth()+1).toString().padStart(2, '0')  + "-"+dateOfInterest.getUTCDate().toString().padStart(2, '0') 
                if(j["Technical Analysis: STOCH"][formattedDate]===undefined){i--;}
                else
                {
                    stochData.push({
                        date:formattedDate,
                        SlowD:j["Technical Analysis: STOCH"][formattedDate].SlowD,
                        SlowK:j["Technical Analysis: STOCH"][formattedDate].SlowK
                    });						
                }
                dateOfInterest = dateOfInterest.addDays(-1);
            }

            return stochData;
        }
        
    );
    
   
const loadMacDData = (symbol) => fetch("https://www.alphavantage.co/query?function=MACD&symbol="+symbol+"&interval=daily&series_type=open&apikey=V8FX6NG9HB7W35GK").then(d=>dailyJson=d.json()).then(
    j=>{
        var macdData = [];
        var dateOfInterest = new Date();
        for(var i = 0; i<100;i++)
        {
            var formattedDate = dateOfInterest.getFullYear() + "-"+(dateOfInterest.getUTCMonth()+1).toString().padStart(2, '0')  + "-"+dateOfInterest.getUTCDate().toString().padStart(2, '0') ;
            if(j["Technical Analysis: MACD"][formattedDate]===undefined){i--;}
            else
            {
            macdData.push({
                date:formattedDate,
                MACD:j["Technical Analysis: MACD"][formattedDate].MACD,
                MACD_Hist:j["Technical Analysis: MACD"][formattedDate].MACD_Hist,
                MACD_Signal:j["Technical Analysis: MACD"][formattedDate].MACD_Signal
            
            });
           
            }
            dateOfInterest = dateOfInterest.addDays(-1);
        }
        return macdData;

    }

);
const selected = (selectedItem)=>{
    var stockSymbol = "";
    var searchBox = document.getElementById("stockSearch");
    if(selectedItem.path[0].innerHTML.startsWith("<div"))
    {
        var temp = selectedItem.path[0].innerHTML;
        stockSymbol = temp.substr(temp.indexOf(">")+1,temp.lastIndexOf("<")-temp.indexOf(">")-1);
    }
    else{
        stockSymbol = selectedItem.path[0].innerHTML;
    }
   searchBox.value = stockSymbol;
   document.getElementById("hover").style.display = "none";
};
const populateStockList = (search) =>
    {
        if(search=="")
        {
            document.getElementById("hover").style.display = "none";
            return null;
        }
        fetch("https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q="+search+"&region=US", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "1ef66d511fmshb32d72c0009c356p1061a3jsnc991cba4e9f9",
                "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
            }
        })
        .then(response => searchJson = response.json()
        )
        .then(j=>{
            //console.log(j)
            document.getElementById("hover").style.display = "block";
            // console.log(search);
            var list = document.getElementById("stockResults");
            var listLength = list.childElementCount;//list.options.length;
            for(var i = 0; i< listLength; i++){list.removeChild(list.childNodes[0]);}//options
            j.quotes.forEach(result =>{//console.log(result["symbol"])
            // var x = document.createElement("OPTION");
                var listItem = document.createElement("LI");
                listItem.className = "listItem";
                var stockSymbolText = document.createElement("DIV");
                stockSymbolText.className = "listItemHeader";      
                stockSymbolText.innerHTML = result["symbol"];
                listItem.append(stockSymbolText);
                listItem.innerHTML =  listItem.innerHTML+" "+ result["shortname"];
                listItem.addEventListener("click", selected,false);
                list.appendChild(listItem)
                }
        )
        })
        .catch(err => {
            console.error(err);
        });
    };

// 2020-11-03
// VM25862:3 2020-11-05
// VM25862:3 2020-11-09
// VM25862:3 2020-11-30
// VM25862:3 2021-01-06
// VM25862:3 2021-01-11
// VM25862:3 2021-01-15
// VM25862:3 2021-01-28
// VM25862:3 2021-02-01
// VM25862:3 2021-02-03
// VM25862:3 2021-02-08
// VM25862:3 2021-02-09
// VM25862:3 2021-02-10

// dyStochastic=dyStochastic.sort(function(a,b){
//     //return a.attributes.OBJECTID - b.attributes.OBJECTID;
//     if(new Date(a.date) == new Date(b.date))
//         return 0;
//     if(new Date(a.date)  <new Date(b.date))
//         return -1;
//     if(new Date(a.date) > new Date(b.date))
//         return 1;
// });
