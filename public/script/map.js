let map;
let service;
let infowindow;
let userMarker;

function initMap() {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("googlemap"), {
    zoom: 14,
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(userLocation);

        // "동물 병원"에 대한 요청에 사용자의 현재 위치 추가
        const request = {
          location: userLocation,
          radius: 5000, // 5km 반경 내에서 검색
          query: '동물 병원',
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        });

        // 사용자 위치에 대한 마커 생성
        userMarker = new google.maps.Marker({
          map: map,
          position: userLocation,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          title: 'Your Location',
        });

        // 사용자 위치 마커에 정보 창을 열도록 이벤트 리스너 추가 (선택 사항)
        google.maps.event.addListener(userMarker, "click", () => {
          infowindow.setContent("내 위치");
          infowindow.open(map, userMarker);
        });
      },
      () => {
        handleLocationError(true, infowindow, map.getCenter());
      }
    );
  } else {
    // 브라우저가 Geolocation을 지원하지 않음
    handleLocationError(false, infowindow, map.getCenter());
  }
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map, marker);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
