import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { subDays, format } from 'date-fns';
import { TopPageService } from 'src/top-page/top-page.service';
import { Builder } from 'xml2js';
import { CategoryURL } from './sitemap.comstants';

@Controller('sitemap')
export class SitemapController {
  private readonly domain: string;

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = configService.get('DOMAIN') ?? '';
  }

  @Get('xml')
  @Header('content-type', 'text/xml')
  async sitemap() {
    const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";
    let res = [
      {
        loc: `${this.domain}`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: `${this.domain}/courses`,
        lastmod: format(subDays(new Date(), 1), formatString),
        changefreq: 'weekly',
        priority: '1.0',
      },
    ];

    const pages = await this.topPageService.findAll();

    res = res.concat(
      pages.map((page) => ({
        loc: `${this.domain}/${CategoryURL[page.firstLevelCategory]}/${page.alias}`,
        lastmod: format(new Date(), formatString),
        changefreq: 'weekly',
        priority: '0.7',
      })),
    );

    const builder = new Builder({
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8',
      },
    });

    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: res,
      },
    });
  }
}
