import { Client } from '../src-minecraft';

const client = new Client('OTY5OTI3Mjg5NzY2ODE3ODMy.Ym0hLg.UGeOrNbzyF1YIwBA5L9NOFMUjGk');

console.log('with counts');
client.getGuild('570758760373420033', { with_counts: true })
.then((guild) => {
  console.log(JSON.stringify(guild));
}).catch((err) => console.error('0', err, '\n' + err.stack));

console.log('without options');
client.getGuild('570758760373420033')
.then((guild) => {
  console.log(JSON.stringify(guild));
}).catch((err) => console.error('1', err, '\n' + err.stack));
