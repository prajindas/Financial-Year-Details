function test(data) {
    document.getElementById('year').innerHTML = `<option value ="" >Select Year  </option>`;
    document.getElementById('list').innerHTML = ` <li class="list-group-item h6"></li>`;
    document.getElementById('error').innerHTML ="";
    document.getElementById("start_date").innerHTML=""
    document.getElementById("end_date").innerHTML=""
    // document.getElementById('year').innerHTML +='<option value ="1" >Option 2</option>';
    var date = new Date();
    var year = date.getFullYear();

    for (i = year - 10; i <= year; i++) {


        if (data.value == 'UK') {
            year_code = i;
        } else {
            ls_next_year = String(i).substring(2, 4);
            ls_next_year = Number(ls_next_year) + 1
            year_code = i + "-" + ls_next_year;
        }
        document.getElementById('year').innerHTML += `<option value ="${i}" >${year_code}</option>`;
    }
}
async function fetchData(select) {
    document.getElementById('list').innerHTML = ` <li class="list-group-item h6"></li>`;
    document.getElementById('error').innerHTML ="";
     document.getElementById("start_date").innerHTML=""
    document.getElementById("end_date").innerHTML=""
    ls_country = document.getElementById("country").value
    ls_year = document.getElementById("year").value
    year = document.getElementById("year").value
    ls_start_month = 1;
    month = 1;
    ls_start_day = 1;
    ls_end_day = 31;
    ls_end_month = 12;



    if (ls_country == 'UK') {
        ls_start_month = 4;
        ls_end_month = 4;
        month = 4;
        ls_start_day = 6;
        ls_end_day = 5;
    }
    k = 0;
    while (k < 1) {
        ls_start_date = new Date(`${ls_start_month} ${ls_start_day}, ${year}`);
        let week = ls_start_date.getDay()
        if (week == 0 || week == 6) {
            ls_start_day++;
        } else {
            k++;
        }

    }
    m = 0;
    while (m < 1) {
        ls_end_date = new Date(`${ls_end_month} ${ls_end_day}, ${year}`);
        let week = ls_end_date.getDay()
        if (week == 0 || week == 6) {
            ls_end_day--;
        } else {
            m++;
        }

    }
    ls_final_date = `${year}-${ls_start_month}-${ls_start_day}`;
    ls_end_date = `${year}-${ls_end_month}-${ls_end_day}`
    const promises = [];
    for (let i = 1; i <= 12; i++) {
   
        if (ls_country == 'UK' && i == 10) {
            month = 1;
            ls_year = Number(ls_year) + 1;
            
        }
     
        promises.push(callAPI(ls_year, month,ls_country));
        month++;
    }

    const data = await Promise.all(promises);
    
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        if(data[i]=="Error"){
            document.getElementById('error').innerHTML ="Need to upgrade premium API version(Try with 2023 year)"
            continue
        }
        for (j = 0; j < data[i].holidays.length; j++) {
            ls_name = data[i].holidays[j].name;
            ls_date = data[i].holidays[j].date;
            ls_start_diff = getNumberOfDays(ls_final_date, ls_date);
            if (ls_start_diff == 0) {
                ls_start_day++;
               

            }
            ls_start_diff = getNumberOfDays(ls_end_date, ls_date);
            if (ls_start_diff == 0) {
                ls_end_day--;
                
            }
            result = ls_date + " : " + ls_name;
            document.getElementById('list').innerHTML += ` <li class="list-group-item h6">${result}</li>`;

        }
    }
  
  

    ls_start_day = (`0${ls_start_day}`).slice(-2);
    ls_start_month = (`0${ls_start_month}`).slice(-2);
    ls_end_day = (`0${ls_end_day}`).slice(-2);
    ls_end_month = (`0${ls_end_month}`).slice(-2);
    ls_final_date=`${year}-${ls_start_month}-${ls_start_day}`
    ls_end_date=`${ls_year}-${ls_end_month}-${ls_end_day}`
    document.getElementById("start_date").innerHTML="Financial Year Start: "+ ls_final_date;
    document.getElementById("end_date").innerHTML="Financial Year End: " + ls_end_date;

}

async function callAPI(year, month,country) {
    const options = { method: 'GET' };
    let apiData;
    if(country=='UK'){
        country="GB";
    }else{
        country="IE";
    }
    try {
        const response = await fetch('https://holidayapi.com/v1/holidays?pretty&key=f784b4e5-6a1a-4e2a-b2c3-93bd8824fa96&country='+country+'&year=' + year + '&month=' + month, options);
        apiData = await response.json();
       
        return apiData;

    } catch (error) {
        return "Error";
    }
    
}


function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    const oneDay = 1000 * 60 * 60 * 24;

    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}