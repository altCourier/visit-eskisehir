const API_HOST = "booking-com.p.rapidapi.com";
const BASE_URL = `https://${API_HOST}`;

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

export async function apiGet(endpoint, params = {}) {
    const url = new URL(BASE_URL + endpoint);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY
        }
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API Error: ${errText}`);
    }

    return res.json();
}

export function getLocationByName(name) {
    return apiGet("/v1/hotels/locations", {
        name,
        locale: "en-gb"
    });
}

export function searchHotels(params) {
    // Note: searchHotels should also ensure 'locale' is present in its params
    // but we'll leave it as is if it's handled upstream.
    return apiGet("/v1/hotels/search", params);
}

export async function getHotelDetails(hotel_id) {
    return apiGet("/v1/hotels/description", {
        hotel_id,
        locale: "en-gb"
    });
}

/**
 * FIX: Added the required 'locale' parameter to the photo endpoint call.
 */
export async function getHotelPhotos(hotel_id) {
    return apiGet("/v1/hotels/photos", {
        hotel_id,
        // The API requires a locale, using 'en-gb' as a standard default
        locale: "en-gb"
    });
}