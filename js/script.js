//Llave de GoogleMaps
var keyAPI = "AIzaSyC4J7dbF82BnnldmAY5MvOkdi_VFKGU-kE";

$(document).ready(function () {
  blockSelect();
  //Entra a metodo selectCalendar 
  selectCalendar();
});

function blockSelect() {
  //Impide el acceso a los select
  $('#actividades').prop('disabled', true);
  $('#instructores').prop('disabled', true);
}

function selectCalendar() {
  activo = true;
  //ID del Calendario
  var id_calendar;
  //De acuerdo al valor del select SHOW da el ID del Calendario
  switch ($('#show').val()) {
    case 'iteso':
      id_calendar = "easyfititeso@gmail.com";
      break;
    case 'villas':
      id_calendar = "easyfitvillas@gmail.com";
      break;
    case 'canadas':
      id_calendar = "easyfitcanadas@gmail.com";
      break;
    case 'oblatos':
      id_calendar = "easyfitoblatos@gmail.com";
      break;
    case 'avila':
      id_calendar = "easyfitavilacamacho@gmail.com";
      break;
    case 'aleira':
      id_calendar = "aleiraeasyfit@gmail.com";
      break;
  }
  blockSelect();
  //Entra a metodo con el ID del Calendario 
  loadCalendar(id_calendar);
  //Espera 1 segundo y carga las actividades
  setTimeout(loadActivities, 1000);
  //Espera 1 segundo y carga los instructores
  setTimeout(loadInstructors, 1000);
}
var horas = [];
var activo = true;
function loadCalendar(id_calendar) {
  horas = [];
  //Elimina el DIV del calendario anterior
  $('#calendar').remove();
  //Crea un DIV para el nuevo calendario
  $("#divcalendar").append("<div id='calendar'></div>");
  //Tipo de calendario (Semanal)
  var type_calendar = 'agendaWeek';
  var prev = "";
  var next = "";
  //Si la ventana es menor a 1240 
  if ($(window).width() < 1240) {
    type_calendar = 'agendaDay'; //El tipo de calendario será por Día
    prev = 'prev';//Para crear día anterior
    next = 'next';//Para crear día siguiente
  }
  //Genera el Calendario en Base a FullCalendar
  $('#calendar').fullCalendar({
    googleCalendarApiKey: keyAPI,
    events: {
      googleCalendarId: id_calendar,
      className: 'gcal-event' // una opcion
    },
    defaultView: type_calendar,
    header: {
      left: prev,
      center: '',
      right: next,
    },
    editable: false,
    allDaySlot: false,
    hiddenDays: [0],
    slotEventOverlap: false,
    eventOverlap: false,
    eventRender: function (event, element) {
      horas.push({ empieza: event.start, termina: event.end });
      element.find('.fc-content').append('<div class="hr-line-solid-no-margin"></div><div class="fc-des" style="font-size: 10px">' + event.description + '</div></div>');
      element.attr('href', 'javascript:void(0);');
      element.click(function () {
        bootbox.alert({
          message: event.description,
          title: event.title,
        });
      });
      element.data('event', event);
    }
  });
  $('.fc-day-grid').remove();
  $('.fc-divider').remove();
}

function loadInstructors() {
  var arrayValues = [];
  $('#instructores').html(''); //Limpiar el select

  $('.fc-des').each(function (index) { //Por cada elemento con clase div-class hacer...
    var text = $(this).text();	//Obtener el texto del elemento en la iteración	this = elemento
    text = $.trim(text); //Eliminar espacios antes y después del texto
    text = text.substring(11, 30);
    $(this).attr('id', text.charAt(1) + text.charAt(2) + text.charAt(3) + text.charAt(4)); //Le agrega un ID igual a su texto
    if ($.inArray(text, arrayValues) === -1) {
      $('#instructores').append('<option value=' + text + '>' + text + '</option>'); //insertar un nodo extra al select con id = instructores
      arrayValues.push(text);
    }
  });

  //Ordena 
  $("#instructores").append($("#instructores option").remove().sort(function (a, b) {
    var at = $(a).text(), bt = $(b).text();
    return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
  }));

  $('#instructores').prepend('<option value="opciones">Instructors</option>'); //insertar el nodo de opciones
  $('#instructores').prop('disabled', false);
  $('#instructores').val("opciones"); //valor incial
}

function loadActivities() {
  var arrayValues = [];
  $('#actividades').html(''); //Limpiar el select

  $('.fc-title').each(function (index) { //Por cada elemento con clase div-class hacer...
    var text = $(this).text();	//Obtener el texto del elemento en la iteración	this = elemento
    text = $.trim(text); //Eliminar espacios antes y después del texto
    $(this).attr('id', text.charAt(0) + text.charAt(1)); //Le agrega un ID igual a su texto
    if ($.inArray(text, arrayValues) === -1) {
      $('#actividades').append('<option value=' + text + '>' + text + '</option>'); //insertar un nodo extra al select con id = actividades
      arrayValues.push(text);
    }
  });

  //Ordena 
  $("#actividades").append($("#actividades option").remove().sort(function (a, b) {
    var at = $(a).text(), bt = $(b).text();
    return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
  }));

  $('#actividades').prepend('<option value="opciones">Activities</option>'); //insertar el nodo de opciones
  $('#actividades').prop('disabled', false);
  $('#actividades').val("opciones"); //valor incial
}

function changeInstructors() {
  var valor = $('#instructores').val();
  $('#actividades').val("opciones");
  if (valor == "opciones") {
    //Si el valor es opciones
    $('.fc-des').each(function (index) {
      $(this).parent().parent().show(); //muestra todas
    });
  } else {
    //Si el valor NO es opciones
    $('.fc-des').each(function (index) {
      //debugger;
      if ($(this).attr('id') !== valor.charAt(0) + valor.charAt(1) + valor.charAt(2) + valor.charAt(3)) {
        //Si el ID es diferente al del select 
        $(this).parent().parent().hide(); //lo esconde
      } else {
        //Si el ID es igual al del select 
        $(this).parent().parent().show(); //lo muestra
      }
    });
  }
}

function changeActivities() {
  var valor = $('#actividades').val();
  $('#instructores').val("opciones");
  if (valor == "opciones") {
    //Si el valor es opciones
    $('.fc-title').each(function (index) {
      $(this).parent().parent().show(); //muestra todas
    });
  } else {
    //Si el valor NO es opciones
    $('.fc-title').each(function (index) {
      if ($(this).attr('id') !== valor.charAt(0) + valor.charAt(1)) {
        //Si el ID es diferente al del select 
        $(this).parent().parent().hide(); //lo esconde
      } else {
        //Si el ID es igual al del select 
        $(this).parent().parent().show(); //lo muestra
      }
    });
  }
}

$(function () {
  //Si el select SHOW cambia llama selectCalendar
  $('#show').change(function () {
    selectCalendar();
  });
  //Si el select actividades cambia llama changeActivities
  $('#actividades').change(function () {
    changeActivities();
  });
  //Si el select instructores cambia llama changeInstructors
  $('#instructores').change(function () {
    changeInstructors();
  });
  $('.fc-button').click(function () {
    $('.fc-day-grid').remove();
    $('.fc-divider').remove();
  });
});
