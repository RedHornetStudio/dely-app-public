// ---Shops Table----

const shopsDataInDatabase = [
  {
    id: 1,
    title: 'Park Buffet',
    description: 'asdf sadf sdf aesf saf sdf sdf sd fasdfgsdg',
    country: 'latvia',
    imageUrl: 'https://wallpapercave.com/wp/wp6701788.jpg',
    telNumber: '+37123271528',
    note: '',
  },
  {
    id: 2,
    title: 'La Pizza',
    description: 'asdf sadf sdf aesf saf sdf sdf sd fasdfgsdg',
    country: 'russia',
    imageUrl: 'https://wallpapercave.com/wp/wp1882028.jpg',
    telNumber: '+37147526849',
    locations: [
      { id: 3, shopId: 2, city: 'Rēzekne', address: 'Atbrīvošanas aleja 4', eMail: 'atbrivosanaslapizza@gmail.com', notes: '', opened: { monday: '11:00-22:00', tuesday: '11:00-22:00', wednesday: '11:00-22:00', thursday: '11:00-22:00', friday: '11:00-22:00', saturday: '13:00-17:00', sunday: 'closed' } },
      { id: 4, shopId: 2, city: 'Rēzekne', address: 'Rīgas iela 10', eMail: 'rigaslapizza@gmail.com', notes: '', opened: { monday: '11:00-22:00', tuesday: '11:00-22:00', wednesday: '11:00-22:00', thursday: '11:00-22:00', friday: '11:00-22:00', saturday: '13:00-17:00', sunday: 'closed' } }
    ],
    note: '',
  },
  {
    id: 3,
    title: 'Grila Dārzs',
    description: 'asdf sadf sdf aesf saf sdf sdf sd fasdfgsdg',
    country: 'latvia',
    imageUrl: 'https://wallpapercave.com/wp/wp7528948.png',
    telNumber: '+37146731456',
    note: '',
  },
  {
    id: 4,
    title: 'Ausmeņa kebabs',
    description: 'asdf sadf sdf aesf saf sdf sdf sd fasdfgsdg',
    country: 'latvia',
    imageUrl: 'https://wallpapercave.com/wp/wp7115963.jpg',
    telNumber: '+37163584769',
    note: '',
  },
];

export default shopsDataInDatabase;