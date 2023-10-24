'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_5fd1f8a8-zone-clinkz:r9yovyc23q2c -k https://lumtest.com/myip.json

  // Configure Bright Data
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch Product Page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $('#productTitle').text();
    const price = formatPrice($('.a-offscreen:first'));
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
    throw new Error(`Failed to scrape product ${error.message}`);
  }
}
