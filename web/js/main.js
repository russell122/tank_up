"use strict";

document.addEventListener('DOMContentLoaded', function () {
  // polyfill flat
  if (!Array.prototype.flat) Array.prototype.flat = function () {
    return function f(arr) {
      return arr.reduce(function (a, v) {
        return Array.isArray(v) ? a.concat(f(v)) : a.concat(v);
      }, []);
    }(this);
  };
});
$(document).ready(function () {
  var swiper = new Swiper('.sectificate-slider__swiper', {
    slidesPerView: 6,
    spaceBetween: 10,
    // loop: true,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 8
      },
      576: {
        slidesPerView: 3,
        spaceBetween: 12
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 12
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 12
      },
      1601: {
        slidesPerView: 6,
        spaceBetween: 30
      }
    } // autoplay: {
    // 	delay: 5000,
    // },

  }); // lightcase

  $('a[data-rel^=lightcase]').lightcase(); // end lightcase
  // menu
  // Появление блока сменю на определенном значении скрола и скрытие

  var navMenuFixed = document.querySelector('.nav');
  var sticky = navMenuFixed.offsetTop;

  function handleScrollMenu() {
    // console.log(window.pageYOffset)
    // console.log(sticky)
    if (window.pageYOffset > 200) {
      navMenuFixed.classList.add('sticky');
    } else {
      navMenuFixed.classList.remove('sticky');
    }
  }

  window.addEventListener('scroll', handleScrollMenu); // Конец Появления блока сменю на определенном значении скрола и скрытия
  // Стилизация самих элементов когда юзер проскролил на связанную страницу с опр. li

  $('.nav li').on('click', function (e) {
    var dataName = $(this).attr('data-menuAnchor');
    e.preventDefault();
    var id = $('[data-anchor="' + dataName + '"]');
    $('html,body').stop().animate({
      scrollTop: $(id).offset().top
    }, 1000);
  });

  function AnchorActive() {
    $('*[data-anchor]').each(function (e) {
      var dataName = $(this).attr('data-anchor');
      var posit = $(this).offset().top - 400;
      var windowPostition = $(window).scrollTop();

      if (windowPostition >= posit) {
        $('.nav li ').removeClass('active');
        $('[data-menuAnchor="' + dataName + '"]').addClass('active');
      }
    });
  }

  ;
  AnchorActive();
  $(window).scroll(function () {
    AnchorActive();
  });
  $(window).resize(function () {
    AnchorActive();
  }); // Конец Стилизации самих элементов когда юзер проскролил на связанную страницу с опр. li
  // end menu
  // modal

  var modals = function modals() {
    function bindModal(triggerSelector, modalSelector) {
      var closeClickOverlay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var trigger = document.querySelectorAll(triggerSelector);
      var modal = document.querySelector(modalSelector);
      var windows = document.querySelectorAll('[data-modal]');
      trigger.forEach(function (item) {
        item.addEventListener('click', function (e) {
          if (item.classList.contains('popup_calc_button')) {
            if (modalState.width === undefined || modalState.height === undefined || modalState.form === undefined) {
              return false;
            }
          }

          if (item.classList.contains('popup_calc_profile_button')) {
            if (modalState.type === undefined || modalState.profile === undefined) {
              return false;
            }
          }

          windows.forEach(function (item) {
            item.style.display = 'none';
          });
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
        });
      });
      modal.addEventListener('click', function (e) {
        if (e.target === modal && closeClickOverlay) {
          windows.forEach(function (item) {
            item.style.display = 'none';
          });
          modal.style.display = 'none';
          document.body.style.overflow = "";
        }

        if (e.target.getAttribute('data-close') == '') {
          modal.style.display = 'none';
          document.body.style.overflow = "";
        }
      });
    }

    bindModal('.popup-btn', '.popup');
    bindModal('.popup__order-btn', '.popup__order');
  };

  modals(); // end modal

  $(".phone").mask("+7 (999) 999-9999"); //BEGIN pie

  $('.circle-elem').circleProgress({
    value: 0.3,
    size: 240,
    thickness: 23,
    fill: {
      gradient: ['#FF8000']
    },
    emptyFill: '#DDEAEE'
  });
  var data = [{
    "genre": "post",
    "percentage": 37,
    "name": "Поставки на АЗС"
  }, {
    "genre": "prom",
    "percentage": 14,
    "name": "Промышленность"
  }, {
    "genre": "torg",
    "percentage": 12,
    "name": "Предприятия",
    "name2": "торгового комплекса"
  }, {
    "genre": "sx",
    "percentage": 12,
    "name": "Сельскохозяйственные",
    "name2": "предприятия"
  }, {
    "genre": "transp",
    "percentage": 10,
    "name": "Транспорт"
  }, {
    "genre": "stroit",
    "percentage": 8,
    "name": "Строительство"
  }]; // if theres more than 3 genres, combine the extras
  // into a new genre titled 'other'

  if (data.length > 6) {
    var otherPercentage = 0; // get other genres

    var dataOther = _.slice(data, 6); // add up the percentages of each of the other genres


    _.forEach(dataOther, function (value, key) {
      otherPercentage += value.percentage;
      otherName += value.name;
      otherName2 += value.name2;
    }); // drop other genres


    data.splice(6); // add new 'other' genre object to original data array

    data.push({
      genre: 'other',
      percentage: otherPercentage,
      name: otherName,
      name2: otherName2
    });
  }

  var svg = d3.select('#flavour-graph');
  svg.append('g').attr('class', 'chart-center').attr('transform', 'translate(350, 250)'); // create collection of pie chart data using d3

  var pie = d3.pie().value(function (d) {
    return d.percentage;
  })(data);

  var _loop = function _loop(i) {
    var genre = data[i].genre;
    var percentage = data[i].percentage;
    var name = data[i].name;
    var name2 = data[i].name2;
    svg.select('.chart-center').append('g').attr('class', "chart-segment__" + genre);
    var arcData = {
      innerRadius: 0,
      outerRadius: 125,
      startAngle: pie[i].startAngle,
      endAngle: pie[i].endAngle // get the drawing coordinates for the segment

    };
    var arcCords = d3.arc()(arcData); // get the center coordinates for the segment

    var center = d3.arc().centroid(arcData); // fix center positiong for text

    center[0] = center[0] - 7 - i * 2; // only draw the first 6 segments

    if (i < 6) {
      // draw segment
      svg.select(".chart-segment__" + genre).append('path').attr('d', arcCords).attr('class', "segment-" + i); // .attr('stroke', '#EA0028')

      var addText = function addText(className, content, offset) {
        var xPos = offset ? center[0] + offset - i * 2 : center[0]; //const yPos = offset ? (center[0] + offset - (i * 1)) : center[0];
        // console.log("segment " + i + ": " + xPos);

        svg.select(".chart-segment__" + genre).append('text').attr('x', xPos).attr('y', center[1]) //.attr('y', yPos)
        .attr('class', className).text(content);
      };

      addText("segment-" + i + "__text", percentage.toFixed());
      addText("segment-" + i + "__text-percentage", '%', 40);
      addText("segment-" + i + "__text-name", name);
      addText("segment-" + i + "__text-name2", name2);
    }

    svg.select('.segment-0__text').attr('x', '70').attr('y', '-18');
    svg.select('.segment-0__text-percentage').attr('x', '95').attr('y', '-18');
    svg.select('.segment-1__text').attr('x', '7').attr('y', '130');
    svg.select('.segment-1__text-percentage').attr('x', '25').attr('y', '130');
    svg.select('.segment-2__text').attr('x', '-100').attr('y', '100');
    svg.select('.segment-2__text-percentage').attr('x', '-80').attr('y', '100');
    svg.select('.segment-3__text').attr('x', '-130').attr('y', '20');
    svg.select('.segment-3__text-percentage').attr('x', '-110').attr('y', '20');
    svg.select('.segment-4__text').attr('x', '-90').attr('y', '-50');
    svg.select('.segment-4__text-percentage').attr('x', '-70').attr('y', '-50');
    svg.select('.segment-5__text').attr('x', '-38').attr('y', '-87');
    svg.select('.segment-5__text-percentage').attr('x', '-25').attr('y', '-87');
    svg.select('.segment-0__text-name').attr('x', '97').attr('y', '-182');
    svg.select('.segment-1__text-name').attr('x', '102').attr('y', '225');
    svg.select('.segment-2__text-name').attr('x', '-305').attr('y', '126');
    svg.select('.segment-2__text-name2').attr('x', '-305').attr('y', '142');
    svg.select('.segment-3__text-name').attr('x', '-350').attr('y', '0');
    svg.select('.segment-3__text-name2').attr('x', '-350').attr('y', '22');
    svg.select('.segment-4__text-name').attr('x', '-300').attr('y', '-82');
    svg.select('.segment-5__text-name').attr('x', '-270').attr('y', '-172');
  };

  for (var i = 0; i < data.length; i += 1) {
    _loop(i);
  } //END pie

});