import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CommentsComponent } from "./comments/comments.component";
import { UsersComponent } from "./users/users.component";
import { ContentComponent } from "./content/content.component";
import { VideosComponent } from "./content/videos/videos.component";
import { PlaylistsComponent } from "./content/playlists/playlists.component";
import { PostsComponent } from "./content/posts/posts.component";
import { HomeComponent } from "./home/home.component";
import { EstadoComponent } from "./configuracao/estado/listar/estado.component";
import { ConfiguracaoComponent } from "./configuracao/configuracao.component";
import { ConvencaoComponent } from "./configuracao/convencao/listar/convencao.component";
import { DepartamentoComponent } from "./configuracao/departamento/listar/departamento.component";
import { EscolaridadeComponent } from "./configuracao/escolaridade/listar/escolaridade.component";
import { CargoListarComponent } from "./configuracao/cargo/cargo-listar/cargo-listar.component";
import { EstadocivilListarComponent } from "./configuracao/estadocivil/estadocivil-listar/estadocivil-listar.component";
import { ProfissaoListarComponent } from "./configuracao/profissao/profissao-listar/profissao-listar.component";
import { PlanoContasListarComponent } from "./configuracao/plano-contas/plano-contas-listar/plano-contas-listar.component";
import { TipoLancamentoListarComponent } from "./configuracao/tipo-lancamento/tipo-lancamento-listar/tipo-lancamento-listar.component";
import { RegiaoListarComponent } from "./configuracao/regiao/regiao-listar/regiao-listar.component";

export default [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'configuracao', component: ConfiguracaoComponent,
    children: [
      { path: 'convencaoListar', component: ConvencaoComponent },
      { path: 'estadoListar', component: EstadoComponent },
      { path: 'departamentoListar', component: DepartamentoComponent },
      { path: 'escolaridadeListar', component: EscolaridadeComponent },
      { path: 'cargoListar', component: CargoListarComponent },
      { path: 'estadocivilListar', component: EstadocivilListarComponent },
      { path: 'profissaoListar', component: ProfissaoListarComponent },
      { path: 'planoContasListar', component: PlanoContasListarComponent },
      { path: 'tipoLancamentoListar', component: TipoLancamentoListarComponent },
      { path: 'regiaoListar', component: RegiaoListarComponent }
    ]
   },
  { path: 'comments', component: CommentsComponent},
  { path: 'users', component: UsersComponent },
  { path: 'content', component: ContentComponent,
    children: [
      { path: 'videos', component: VideosComponent },
      { path: 'playlists', component: PlaylistsComponent },
      { path: 'posts', component: PostsComponent }
    ]
   }
] as Routes;
