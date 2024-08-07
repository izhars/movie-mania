import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CrewList from './CrewList'; // Assuming CrewList component is in './CrewList.js'
import Loader from './Loader'

const TVSeasonCast = ({ route }) => {
    const { seriesId, season_no } = route.params;
    console.log("sdbuhvu", seriesId, season_no)
    const [crew, setCrew] = useState([]);
    const [cast, setCast] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovieCrew = async () => {
            try {
                let url = '';
                if (season_no) {
                    url = `https://api.themoviedb.org/3/tv/${seriesId}/season/${season_no}/credits?language=en-US`;
                } else {
                    url = `https://api.themoviedb.org/3/tv/${seriesId}/credits?language=en-US`;
                }

                const response = await fetch(url, {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2U0YjcwMTVlOGEwOTNhNjZjNWRkM2Y0MWY2MzNhNCIsIm5iZiI6MTcyMDY5NjM2My4wNzY1NDgsInN1YiI6IjY0Yjc2ZjBiZjI2M2JhMDEzOWYzZmQ2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1wZ4LaNYzBzRaoU0ivyUa896baVrQ7c0EjZ4NhUmA60',
                        Accept: 'application/json',
                    },
                });
                const data = await response.json();
                setCrew(data.crew || []);
                setCast(data.cast || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching crew data:', error);
                setIsLoading(false);
            }
        };

        fetchMovieCrew();
    }, [seriesId, season_no]);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Loader />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CrewList crew={crew} cast={cast} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TVSeasonCast;
