"use client"

import { useEffect, useRef, useState } from "react"
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { MarkerClusterer } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

const containerStyle = {
  width: "100%",
  height: "80vh",
}

export default function LaundromatsExplorePage() {
  const [laundromats, setLaundromats] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [search, setSearch] = useState("")
  const [borough, setBorough] = useState("")
  const [rating, setRating] = useState("")
  const mapRef = useRef<any>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  useEffect(() => {
    async function fetchLaundromats() {
      const { data, error } = await supabase.from("participating_laundromats").select("*")
      if (error) {
        setLaundromats([])
      } else {
        setLaundromats(data || [])
        setFiltered(data || [])
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

  // Filtering
  useEffect(() => {
    let result = laundromats
    if (search) {
      result = result.filter((l) =>
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.address?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (borough && borough !== 'all') {
      result = result.filter((l) => l.borough === borough)
    }
    if (rating && rating !== 'any') {
      result = result.filter((l) => l.rating && l.rating >= parseFloat(rating))
    }
    setFiltered(result)
  }, [search, borough, rating, laundromats])

  // Map bounds sync
  const onMapIdle = () => {
    if (!mapRef.current) return
    const bounds = mapRef.current.getBounds()
    if (!bounds) return
    setFiltered(
      laundromats.filter((l) => {
        const lat = typeof l.latitude === "string" ? parseFloat(l.latitude) : l.latitude
        const lng = typeof l.longitude === "string" ? parseFloat(l.longitude) : l.longitude
        return bounds.contains({ lat, lng })
      })
    )
  }

  // Two-way sync: scroll to card on marker click, open info window on card click
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (selected && listRef.current) {
      const idx = filtered.findIndex((l) => l.laundromat_id === selected.laundromat_id)
      if (idx >= 0) {
        const el = listRef.current.children[idx] as HTMLElement
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [selected, filtered])

  if (!isLoaded) return <div>Loading map...</div>

  // Borough options
  const boroughs = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]

  // Default center: NYC
  const center = userLocation || { lat: 40.7128, lng: -74.006 }

  return (
    <div className="flex flex-row w-full h-[90vh]">
      {/* List */}
      <div className="w-full md:w-1/3 h-full overflow-y-auto border-r bg-white" ref={listRef}>
        <div className="p-4 sticky top-0 z-10 bg-white border-b">
          <Input
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Select value={borough} onValueChange={setBorough}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Filter by borough" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boroughs</SelectItem>
                {boroughs.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Min. Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {[5,4.5,4,3.5,3].map((r) => (
                  <SelectItem key={r} value={r.toString()}>{r}+</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {filtered.map((laundromat, idx) => (
          <div
            key={laundromat.laundromat_id || idx}
            className={`p-4 border-b cursor-pointer transition bg-white ${selected && selected.laundromat_id === laundromat.laundromat_id ? "bg-blue-50" : ""}`}
            onClick={() => setSelected(laundromat)}
          >
            <div className="font-bold text-lg mb-1">{laundromat.name}</div>
            {laundromat.photo_reference && (
              <img 
                src={laundromat.photo_reference}
                alt={laundromat.name} 
                className="w-full h-32 object-cover rounded mb-2" 
              />
            )}
            <div className="text-sm text-muted-foreground mb-1">{laundromat.address}</div>
            <div className="flex gap-2 text-xs">
              {laundromat.rating && <span>⭐ {laundromat.rating}</span>}
              {laundromat.borough && <span>{laundromat.borough}</span>}
            </div>
          </div>
        ))}
      </div>
      {/* Map */}
      <div className="flex-1 h-full">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={(map) => { mapRef.current = map; }}
          onIdle={onMapIdle}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
              title="Your Location"
            />
          )}
          <MarkerClusterer>
            {(clusterer) => (
              <>
                {filtered
                  .map((laundromat, idx) => {
                    const lat = typeof laundromat.latitude === "string" ? parseFloat(laundromat.latitude) : laundromat.latitude
                    const lng = typeof laundromat.longitude === "string" ? parseFloat(laundromat.longitude) : laundromat.longitude
                    if (isNaN(lat) || isNaN(lng)) return null
                    return (
                      <Marker
                        key={laundromat.laundromat_id || idx}
                        position={{ lat, lng }}
                        clusterer={clusterer}
                        onClick={() => setSelected(laundromat)}
                        title={laundromat.name}
                        icon={selected && selected.laundromat_id === laundromat.laundromat_id ? undefined : undefined}
                      />
                    )
                  })
                  .filter(Boolean)}
              </>
            )}
          </MarkerClusterer>
          {selected && (
            <InfoWindow
              position={{
                lat: typeof selected.latitude === "string" ? parseFloat(selected.latitude) : selected.latitude,
                lng: typeof selected.longitude === "string" ? parseFloat(selected.longitude) : selected.longitude,
              }}
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
      </div>
    </div>
  )
} 