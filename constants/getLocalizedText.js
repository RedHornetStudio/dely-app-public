const text = {
  en: {
    // shop
    chooseCountry: 'Choose country where you will use application',
    cafes: 'Cafes',
    belowCafesText: 'List of all available cafes',
    favorites: 'Favorites',
    belowFavoritesText: 'List of your favorite cafes',
    search: 'Search',
    searchForShop: 'Search for cafe',
    today: 'Today',
    opened: 'Opened',
    closed: 'Closed',
    somethingWentWrong: 'Something went wrong, check your internet connection',
    loading: 'Loading...',
    noShops: 'No cafes found',
    noLocations: 'No locations found',
    noProducts: 'No products found',
    noFavorites: 'No favorite cafes found. Start adding some!',
    noCafesMatchYourSearch: 'No cafes match your search',
    noLocationsMatchYourSearch: 'No locations match your search',
    noMealsMatchYourSearch: 'No meals match your search',
    noCountriesMatchYourSearch: 'No countries match your search', // translate to other languages
    noLanguagesMatchYourSearch: 'No languages match your search', // translate to other languages
    // settings
    languageToChoose: 'Language you will use while using application',
    countryToChoose: 'Country where you will use application',
  },
  ru: {
    // shop
    chooseCountry: 'Выберите страну, в которой вы будете использовать приложение',
    cafes: 'Кафе',
    belowCafesText: 'Список всех доступных кафе',
    favorites: 'Избранное',
    belowFavoritesText: 'Список избранных кафе',
    search: 'Поиск',
    searchForShop: 'Поиск кафе',
    today: 'Сегодня',
    opened: 'Открыто',
    closed: 'Закрыто',
    somethingWentWrong: 'Что-то пошло не так, проверьте подключение к интернету',
    loading: 'Загрузка...',
    noShops: 'Кафе не найдены',
    noLocations: 'Местоположений не найдено',
    noProducts: 'Продукты не найдены',
    noFavorites: 'Избранных кафе не найдено. Добавьте некоторые!',
    noCafesMatchYourSearch: 'Нет кафе, соответствующих вашему запросу',
    // settings
    languageToChoose: 'Язык, который вы будете использовать при использовании приложения',
    countryToChoose: 'Страна, в которой вы будете использовать приложение',
  },
  lv: {
    // shop
    chooseCountry: 'Izvēlieties valsti, kurā izmantosiet aplikāciju',
    cafes: 'Kafejnīcas',
    belowCafesText: 'Visu pieejamo kafejnīcu saraksts',
    favorites: 'Atlasītās',
    belowFavoritesText: 'Atlasīto kafejnīcu saraksts',
    search: 'Meklēšana',
    searchForShop: 'Kafejnīcas meklešana',
    today: 'Šodien',
    opened: 'Atverts',
    closed: 'Aizverts',
    somethingWentWrong: 'Radās problēma, pārbaudiet interneta savienojumu',
    loading: 'Notiek ielāde...',
    noShops: 'Netika atrasta neviena kafejnīca',
    noLocations: 'Netika atrasta neviena atrašanās vieta',
    noProducts: 'Netika atrasts neviens produkts',
    noFavorites: 'Netika atrasta neviena atlasītā kafejnīca. Pievienojiet dažas!',
    noCafesMatchYourSearch: 'Neviena kafejnīca neatbilst jūsu meklēšanas kritērijiem',
    // settings
    languageToChoose: 'Valoda kuru izmantosiet lietojot aplikāciju',
    countryToChoose: 'Valsts kurā jūs izmantosiet aplikāciju',
  },
};

// Languages
export const languages = {
  en: 'English',
  enTranslated: 'English',
  ru: 'Russian',
  ruTranslated: 'Русский',
  lv: 'Latvian',
  lvTranslated: 'Latviešu',
};

// Countries
text.en.countries = {
  latvia: 'Latvia',
  russia: 'Russia',
  estonia: 'Estonia',
  lithuania: 'Lithuania',
  latvia1: 'Latvia1',
  russia1: 'Russia1',
  estonia1: 'Estonia1',
  lithuania1: 'Lithuania1',
  latvia2: 'Latvia2',
  russia2: 'Russia2',
  estonia2: 'Estonia2',
  lithuania2: 'Lithuania2',
  latvia3: 'Latvia3',
  russia3: 'Russia3',
  estonia3: 'Estonia3',
  lithuania3: 'Lithuania3',
  latvia4: 'Latvia4',
  russia4: 'Russia4',
  estonia4: 'Estonia4',
  lithuania4: 'Lithuania4',
  latvia5: 'Latvia5',
  russia5: 'Russia5',
  estonia5: 'Estonia5',
  lithuania5: 'Lithuania5',
  latvia6: 'Latvia6',
  russia6: 'Russia6',
  estonia6: 'Estonia6',
  lithuania6: 'Lithuania6',
};
text.ru.countries = {
  latvia: 'Латвия',
  russia: 'Россия',
  estonia: 'Эстония',
  lithuania: 'Литва',
};
text.lv.countries = {
  latvia: 'Latvija',
  russia: 'Krievija',
  estonia: 'Igaunija',
  lithuania: 'Lietuva',
};

// Setting available localizations
const a = [];
for (const [key] of Object.entries(text)) {
  a.push(key);
}
export const availableLocalizations = a;

// Setting available countries
const b = [];
for (const [key] of Object.entries(text.en.countries)) {
  b.push(key);
}
export const availableCountries = b;

const getLocalizedText = appLanguage => {
  return text[appLanguage];
};

export default getLocalizedText;