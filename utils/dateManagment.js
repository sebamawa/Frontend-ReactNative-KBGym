const Months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const YearsOfWork = [];
for (let i = 2022; i <= new Date().getFullYear(); i++) {
    YearsOfWork.push(i);
}

const getMonthName = (dateString) => { // dateString: "YYYY-MM-DD"
    const monthString = Months[parseInt(dateString.substring(5, 7)) - 1];
    return monthString;
}    

export { Months, YearsOfWork, getMonthName };