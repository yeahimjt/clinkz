'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  const apiKey = String(process.env.SCRAPERAPI_API_KEY); // Replace with your ScrapingBee API key
  try {
    // Set up the ScrapingBee API request
    const scrapingBeeUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
      url
    )}`;

    const response = await axios.get(scrapingBeeUrl);

    if (response.status !== 200) {
      console.log(`Failed to scrape product - HTTP Status: ${response.status}`);
      return null;
    }

    const $ = cheerio.load(response.data);
    let title = $('#productTitle').text().trim();
    console.log(title);

    if (!title) return null;

    const price = formatPrice($('.a-offscreen:first').text());
    const rating = $(
      '.a-popover-trigger.a-declarative .a-size-base.a-color-base:first'
    ).text();
    const rating_count = $('#acrCustomerReviewText.a-size-base:first')
      .text()
      .split(' ')[0];
    const amazons_choice = $(
      '.a-size-small.aok-float-left.ac-badge-rectangle'
    ).text()
      ? true
      : false;
    const recommend = $('.a-histogram-row.a-align-center')
      .text()
      .split('%')[0]
      .split('r')[1];
    const image = $('img.a-dynamic-image').attr('src');

    return {
      url: String(url),
      title,
      current_price: price,
      highest_price: price,
      lowest_price: price,
      average_price: price,
      rating,
      rating_count,
      amazons_choice,
      recommend,
      image,
      id: undefined,
    };
  } catch (error: any) {
    console.log(`Failed to scrape product ${error.message}`);
  }
}
