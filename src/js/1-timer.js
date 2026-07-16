import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('button[data-start]');

const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');

let userSelectedDate = null;

btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      btnStart.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    } else {
      userSelectedDate = selectedDates[0];
      btnStart.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

let timerId = null;

btnStart.addEventListener('click', () => {
  btnStart.disabled = true;
  datetimePicker.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const deltaTime = userSelectedDate - currentTime;

    if (deltaTime <= 0) {
      clearInterval(timerId);
      datetimePicker.disabled = false;

      daysSpan.textContent = '00';
      hoursSpan.textContent = '00';
      minutesSpan.textContent = '00';
      secondsSpan.textContent = '00';
      return;
    }

    const time = convertMs(deltaTime);

    daysSpan.textContent = addLeadingZero(time.days);
    hoursSpan.textContent = addLeadingZero(time.hours);
    minutesSpan.textContent = addLeadingZero(time.minutes);
    secondsSpan.textContent = addLeadingZero(time.seconds);
  }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
