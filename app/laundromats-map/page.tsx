"use client"

import { useEffect, useState } from "react"
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

const containerStyle = {
  width: "100%",
  height: "80vh",
}

export default function LaundromatsMapPage() {
  const [laundromats, setLaundromats] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  useEffect(() => {
    async function fetchLaundromats() {
      const { data, error } = await supabase.from("participating_laundromats").select("*")
      if (error) {
        console.error("Error fetching laundromats from Supabase:", error)
        setLaundromats([])
      } else {
        setLaundromats(data || [])
      }
    }
    fetchLaundromats()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      )
    }
  }, [])

  if (!isLoaded) return <div>Loading map...</div>

  // Default center: NYC
  const center = userLocation || { lat: 40.7128, lng: -74.006 }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Laundromats Map</CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                title="Your Location"
              />
            )}
            {laundromats.map((laundromat, idx) => {
              const lat = typeof laundromat.latitude === "string" ? parseFloat(laundromat.latitude) : laundromat.latitude
              const lng = typeof laundromat.longitude === "string" ? parseFloat(laundromat.longitude) : laundromat.longitude
              if (isNaN(lat) || isNaN(lng)) return null
              return (
                <Marker
                  key={laundromat.laundromat_id || idx}
                  position={{ lat, lng }}
                  onClick={() => setSelected(laundromat)}
                  title={laundromat.name}
                />
              )
            })}
            {selected && (
              <InfoWindow
                position={{ lat: typeof selected.latitude === "string" ? parseFloat(selected.latitude) : selected.latitude, lng: typeof selected.longitude === "string" ? parseFloat(selected.longitude) : selected.longitude }}
                onCloseClick={() => setSelected(null)}
              >
                <div style={{ maxWidth: 300 }}>
                  <strong style={{ fontSize: 18 }}>{selected.name}</strong>
                  {selected.photo_reference && (
                    <img
                      src={selected.photo_reference}
                      alt={selected.name}
                      style={{ width: "100%", margin: "8px 0", borderRadius: 8, maxHeight: 160, objectFit: "cover" }}
                    />
                  )}
                  <div style={{ marginBottom: 4 }}>{selected.address}</div>
                  {selected.rating && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: "#fbbf24", fontWeight: "bold" }}>{selected.rating} ★</span>
                      {selected.total_user_ratings && (
                        <span style={{ color: "#888", marginLeft: 4 }}>({selected.total_user_ratings} reviews)</span>
                      )}
                    </div>
                  )}
                  {selected.phone && (
                    <div>
                      <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                    </div>
                  )}
                  {selected.hours_of_operation && (
                    <div>
                      <strong>Hours:</strong> {selected.hours_of_operation}
                    </div>
                  )}
                  {selected.borough && <div>Borough: {selected.borough}</div>}
                  {selected.accessible !== undefined && (
                    <div>Accessible: {selected.accessible ? "Yes" : "No"}</div>
                  )}
                  {selected.top_review_text && (
                    <div style={{ marginTop: 8, fontStyle: "italic" }}>
                      “{selected.top_review_text}”
                      {selected.top_review_author && (
                        <div style={{ fontWeight: "bold", fontSize: 12, marginTop: 2 }}>- {selected.top_review_author}</div>
                      )}
                      {selected.top_review_rating && (
                        <div style={{ color: "#fbbf24", fontSize: 12 }}>{selected.top_review_rating} ★</div>
                      )}
                    </div>
                  )}
                  {selected.google_maps_url && (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={selected.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1a73e8", textDecoration: "underline" }}
                      >
                        Directions
                      </a>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </CardContent>
      </Card>
    </div>
  )
} 