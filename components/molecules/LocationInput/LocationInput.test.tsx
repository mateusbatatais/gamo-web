// components/molecules/LocationInput/LocationInput.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationInput } from "./LocationInput";
import { useGoogleMapsPlaces } from "@/hooks/location/useGoogleMapsPlaces";
import { useToast } from "@/contexts/ToastContext";

// Mock dependencies
vi.mock("@/hooks/location/useGoogleMapsPlaces");
vi.mock("@/contexts/ToastContext");

const mockSearchPlaces = vi.fn();
const mockGetPlaceDetails = vi.fn();
const mockGetCurrentLocation = vi.fn();
const mockShowToast = vi.fn();

describe("LocationInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useGoogleMapsPlaces as ReturnType<typeof vi.fn>).mockReturnValue({
      loading: false,
      suggestions: [],
      searchPlaces: mockSearchPlaces,
      getPlaceDetails: mockGetPlaceDetails,
      getCurrentLocation: mockGetCurrentLocation,
      isGoogleMapsLoaded: true,
    });

    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      showToast: mockShowToast,
    });
  });

  it("renders with label and placeholder", () => {
    render(<LocationInput label="Location" placeholder="Enter address..." />);

    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter address...")).toBeInTheDocument();
  });

  it("displays value when provided", () => {
    const locationData = {
      formattedAddress: "123 Main St, City, State",
      address: "123 Main St, City, State",
      zipCode: "12345",
      city: "City",
      state: "State",
      latitude: 0,
      longitude: 0,
    };

    render(<LocationInput value={locationData} />);

    expect(screen.getByDisplayValue("123 Main St, City, State")).toBeInTheDocument();
  });

  it("calls onChange when location is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    mockGetPlaceDetails.mockResolvedValue({
      formattedAddress: "456 Oak Ave, Town, ST",
      zipCode: "67890",
      city: "Town",
      state: "ST",
      latitude: 1.23,
      longitude: 4.56,
    });

    (useGoogleMapsPlaces as ReturnType<typeof vi.fn>).mockReturnValue({
      loading: false,
      suggestions: [
        {
          id: 1,
          label: "456 Oak Ave, Town, ST",
          placeId: "place123",
        },
      ],
      searchPlaces: mockSearchPlaces,
      getPlaceDetails: mockGetPlaceDetails,
      getCurrentLocation: mockGetCurrentLocation,
      isGoogleMapsLoaded: true,
    });

    render(<LocationInput onChange={onChange} />);

    const input = screen.getByPlaceholderText("Digite sua cidade ou endereço...");
    await user.type(input, "Oak");

    await waitFor(() => {
      expect(mockSearchPlaces).toHaveBeenCalledWith("Oak");
    });
  });

  it("shows toast on successful geolocation", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    mockGetCurrentLocation.mockResolvedValue({
      formattedAddress: "Current Location",
      zipCode: "11111",
      city: "Current City",
      state: "CC",
      latitude: 9.87,
      longitude: 6.54,
    });

    render(<LocationInput onChange={onChange} successMessage="Location found!" />);

    const geoButton = screen.getByTitle("Usar minha localização atual");
    await user.click(geoButton);

    await waitFor(() => {
      expect(mockGetCurrentLocation).toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith("Location found!", "success");
      expect(onChange).toHaveBeenCalledWith({
        formattedAddress: "Current Location",
        address: "Current Location",
        zipCode: "11111",
        city: "Current City",
        state: "CC",
        latitude: 9.87,
        longitude: 6.54,
      });
    });
  });

  it("disables geolocation button when disabled prop is true", () => {
    render(<LocationInput disabled />);

    const geoButton = screen.getByTitle("Usar minha localização atual");
    expect(geoButton).toBeDisabled();
  });
});
