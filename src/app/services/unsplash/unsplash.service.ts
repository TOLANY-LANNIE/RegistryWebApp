import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private accessKey = environment.unsplash;
  private apiUrl = 'https://api.unsplash.com';

  constructor(private http: HttpClient) { }

  searchPhotos(query: string, page: number = 1, perPage: number = 1): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Client-ID ${this.accessKey}`);
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get(`${this.apiUrl}/search/photos`, { headers, params });
  }
}
