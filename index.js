require('dotenv').config()
const { log } = require('console')
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')

const apiKey = process.env.TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())


app.get('/api/popular', async (request, response) => {
    try {
        const page = request.query.page || 1;
        const popular = await axios.get(`${baseUrl}/movie/popular?api_key=${apiKey}&page=${page}`);
        response.json(popular.data); 
    } catch (error) {
        console.error('Error fetching popular movies:', error.message);
        response.status(500).json({ error: 'Failed to fetch popular movies' });
    }
});

app.get('/api/upcoming', async (request, response) => {
    try {
        const page = request.query.page || 1;
        const upcoming = await axios.get(`${baseUrl}/movie/upcoming?api_key=${apiKey}&page=${page}`);
        response.json(upcoming.data); 
    } catch (error) {
        console.error('Error fetching upcoming movies:', error.message);
        response.status(500).json({ error: 'Failed to fetch upcoming movies' });
    }
});

app.get('/api/search', async (request, response) => {
    try {
        const queryTerm = request.query.query || '';
        const search = await axios.get(`${baseUrl}/search/movie?api_key=${apiKey}&query=${queryTerm}`); 
        response.json(search.data); 
    } catch (error) {
        console.error('Error searching for movies:', error.message);
        response.status(500).json({ error: 'Failed to search for movies' });
    }
});

app.get('/api/movie/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const movie = await axios.get(`${baseUrl}/movie/${id}?api_key=${apiKey}`); 
        response.json(movie.data); 
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        response.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

app.get('/api/movie/:id/credits', async (request, response) => {
    try {
        const id = request.params.id;
        const credits = await axios.get(`${baseUrl}/movie/${id}/credits?api_key=${apiKey}`); 
        response.json(credits.data); 
    } catch (error) {
        console.error('Error fetching movie credits:', error.message);
        response.status(500).json({ error: 'Failed to fetch movie credits' });
    }
});

const unknownEndpoint = (request,response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})