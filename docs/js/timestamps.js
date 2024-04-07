document.addEventListener('DOMContentLoaded', () => {
  const times = document.querySelectorAll('time');

  for (const time of times) {
    if (time.innerHTML.startsWith('Updated ')) {
      time.innerHTML = 'Updated ' + moment(time.innerHTML.replace('Updated ', '')).format('MMMM Do YYYY');
    } else {
      time.innerHTML = moment(time.innerHTML).format('MMMM Do YYYY');
    }
  }
});