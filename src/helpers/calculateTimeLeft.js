import moment from 'moment/moment.js';

const calculateTimeLeft = (expirationDate) => {
  const inputDate = expirationDate;
  const outputFormat = 'YYYY-MM-DDTHH:mm:ssZ';
  const formattedDate = moment(inputDate, 'DD.MM.YYYY, HH:mm').format(outputFormat);

  const now = moment();
  const expirationMoment = moment(formattedDate);
  const difference = expirationMoment.diff(now);
  const duration = moment.duration(difference);

  return {
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds()
  };
}

export default calculateTimeLeft;