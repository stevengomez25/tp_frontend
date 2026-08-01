import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface Template {
  id?: string;
  title: string;
  lang: string;
  updatedAt: string;
  subject: string;
}

export interface Folder {
  id?: string;
  name: string;
  open?: boolean;
  templates: Template[];
}

export interface TemplateStats {
  totalTemplates: number;
  totalFolders: number;
  slotsUsagePercentage: number;
}

export interface CreateTemplateDto {
  title: string;
  folderId: string;
  subject: string;
  content: string;
  lang: string;
}

export interface TemplateDetail extends Template {
  subject: string;
  content: string;
  folderId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private http = inject(HttpClient);

  // URLs Base Limpias alineadas con REST
  private readonly FOLDERS_API_URL = `${environment.apiUrl}/api/folders`;
  private readonly TEMPLATES_API_URL = `${environment.apiUrl}/api/templates`;

  // Signals para manejar el estado global
  public folders = signal<Folder[]>([]);
  public stats = signal<TemplateStats | null>(null);
  public isLoading = signal<boolean>(false);

  // ELIMINAMOS getAuthHeaders() POR COMPLETO 🧹

  public createFolder(folderName: string): Observable<Folder> {
    return this.http
      .post<Folder>(
        this.FOLDERS_API_URL,
        { name: folderName, isShared: false } // El interceptor pondrá el token aquí
      )
      .pipe(
        tap({
          next: (newFolder) => {
            this.folders.update((currentFolders) => [
              ...currentFolders,
              {
                ...newFolder,
                open: false,
                templates: newFolder.templates || [],
              },
            ]);
            this.getTemplateStats().subscribe();
          },
        }),
      );
  }

  public getFoldersAndTemplates(): Observable<Folder[]> {
    this.isLoading.set(true);
    return this.http.get<Folder[]>(this.FOLDERS_API_URL).pipe( // Limpio, sin opciones extra
      tap({
        next: (data) => {
          const structuralData = data.map(f => ({ 
            ...f, 
            open: f.open ?? false,
            templates: (f.templates || []).map((t: any) => ({
              ...t,
              title: t.title || t.name 
            }))
          }));
          this.folders.set(structuralData);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      })
    );
  }

  public getTemplateStats(): Observable<TemplateStats> {
    return this.http
      .get<TemplateStats>(`${this.TEMPLATES_API_URL}/stats`) // Limpio
      .pipe(tap((stats) => this.stats.set(stats)));
  }

  public createTemplate(template: CreateTemplateDto): Observable<any> {
    const payload = {
      ...template,
      folderId: +template.folderId,
    };
    return this.http
      .post<any>(this.TEMPLATES_API_URL, payload) // Limpio
      .pipe(
        tap({
          next: () => this.getFoldersAndTemplates().subscribe(),
        }),
      );
  }

  public deleteTemplate(id: string): Observable<any> {
    return this.http.delete(`${this.TEMPLATES_API_URL}/${id}`); // Limpio
  }

  public getTemplateById(id: string): Observable<TemplateDetail> {
    return this.http.get<TemplateDetail>(`${this.TEMPLATES_API_URL}/${id}`);
  }
}