import React, { useState, useEffect, useRef, FC } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Pressable,
  Image,
  Linking,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { getVenues, getGigsByVenue, getGigs } from "../utils/api";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get("window");

const Map: FC = () => {
  const [venues, setVenues] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [venueId, setVenueId] = useState(11);
  const mapRef: any = useRef(null);
  const navigation: any = useNavigation();

  const handleUserPress = (id: number) => {
    navigation.navigate("Gig", { id: id });
  };
  const image = {
    uri: "https://www.pinpng.com/pngs/m/1-19405_hand-with-white-outline-forming-a-rock-on.png",
  };

  const Item = ({
    bandName,
    genre,
    description,
    id,
    date,
    small_url,
    big_url,
  }: {
    bandName: string;
    genre: string;
    description: string;
    id: number;
    date: string;
    small_url: string;
    big_url: string;
  }) => (
    <View style={styles.gigView}>
      <Pressable onPress={() => handleUserPress(id)}>
        <Text style={styles.gigHeading}>{bandName}</Text>
        <Image source={{ uri: small_url }} style={styles.smallUrlPic}></Image>
        <Text style={styles.gigText}>{description}</Text>
        <Text style={styles.gigText}>{genre}</Text>
        <Text style={styles.gigText}>{date}</Text>
      </Pressable>
    </View>
  );

  useEffect(() => {
    getVenues().then((res: any) => {
      setVenues(res);
    });
    getGigsByVenue(venueId).then((res: any) => {
      setGigs(res);
    });
    getGigs().then((res: any) => {
      console.log(res);
    });
  }, [venueId]);

  const londonRegion = {
    latitude: 51.49307,
    longitude: -0.22559,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const goToLondon = () => {
    mapRef.current.animateToRegion(londonRegion, 3 * 1000);
  };

  const renderItem = ({ item }: { item: any }) => (
    <Item
      bandName={item.bandName}
      description={item.description}
      genre={item.genre}
      id={item.id}
      date={item.date}
      small_url={item.small_url}
      big_url={item.big_url}
    />
  );

  return (
    <FlatList
      data={gigs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <MapView style={styles.map} initialRegion={londonRegion} ref={mapRef}>
            {venues.map((venue: any) => {
              return (
                <Marker
                  key={venue.id}
                  coordinate={{
                    latitude: venue.latitude,
                    longitude: venue.longitude,
                  }}
                  onPress={() => setVenueId(venue.id)}
                >
                  <Image
                    style={styles.marker}
                    source={{
                      uri: "https://www.pinpng.com/pngs/m/1-19405_hand-with-white-outline-forming-a-rock-on.png",
                    }}
                  ></Image>
                  <Callout>
                    <Text style={styles.venName}>{venue.name}</Text>
                    <Text
                      style={styles.venPhone}
                      onPress={() => Linking.openURL(`tel:${venue.phone}`)}
                    >
                      {venue.phone}
                    </Text>
                    <Text>{venue.address}</Text>
                    <Text>Opens: {venue.opens}</Text>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
          <View style={styles.mapButtons}>
            <Text style={styles.FilterButtonText}>Filter</Text>
          </View>
          <View>
            <Pressable style={styles.button} onPress={() => goToLondon()}>
              <Text style={styles.gigText}>Re-center</Text>
            </Pressable>
            <Pressable style={styles.button}>
              <Text style={styles.gigText}>Add gig</Text>
            </Pressable>
          </View>
          <View>
            <Text style={styles.gigHeading}>UPCOMING GIGS:</Text>
          </View>
        </>
      }
    />
  );
};
const styles = StyleSheet.create({
  ButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  venName: {
    fontWeight: "bold",
  },
  venPhone: {
    fontStyle: "italic",
  },
  FilterButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  marker: {
    height: 50,
    width: 50,
    borderRadius: 20,
  },
  mapButtons: {
    position: "absolute",
    top: "3%",
    alignSelf: "flex-start",
    borderRadius: 10,
    borderWidth: 2,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    height: 25,
    width: 100,
    borderColor: "black",
    marginLeft: 10,
  },
  map: {
    width: width - 20,

    height: 440,
    borderTopRightRadius: 50,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 2,
    marginBottom: 10,
    justifyContent: "center",
  },
  gigView: {
    width: width - 20,
    padding: 20,
    backgroundColor: "black",
    opacity: 0.75,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "justify",
    elevation: 3,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "white",
    shadowOffset: { width: 1, height: 0.1 },
    shadowOpacity: 2,
    shadowRadius: 8,
  },
  gigHeading: {
    color: "#fff",
    fontSize: 18,
    opacity: 1,
    margin: 5,
    fontWeight: "900",
  },
  gigText: {
    color: "#fff",
    fontSize: 18,
    opacity: 1,
    margin: 5,
  },
  smallUrlPic: {
    height: 100,
    width: 100,
    borderRadius: 15,
    alignSelf: "center",
  },
});

export default Map;
