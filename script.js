// получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
inputCitiesTo = formSearch.querySelector('.input__cities-to'),
dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
inputDataDepart = formSearch.querySelector('.input__date-depart');

// данные
const citiesApi = 'dataBase/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'e7542488f389bc47341653e1c1972a88',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';



let city = [];

// функции
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });
    request.send();
}

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });

        //фильтр в dropdown в алфавитном порядке
        filterCity.sort((a, b) => {
            if (a.name > b.name) {return 1;}
            if (a.name < b.name) {return -1;}
            return 0;
          });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }

};

const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};


// сортировка по цене
const renderCheapYear = (cheapTickets) => {
    cheapTickets.sort((a, b) => {
        if (a.value > b.value) {return 1;}
        if (a.value < b.value) {return -1;}
        return 0;
      });
      console.log('cheapTickets: sort by price', cheapTickets);
};


const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};



// обработчики событий
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault()

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = city.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDataDepart.value,
    };

    const requestData = `?depart_date=${formData.when}&origin=${formData.from}`+
    `&destination=${formData.to}&one_way=true`;

    getData(calendar + requestData, (response) => {
        renderCheap(response, formData.when);
    });

});


// вызовы функций
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    console.log(city);

});



/*

(item) => {
    return item.name
}

*/