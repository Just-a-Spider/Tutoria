import { NgModule } from '@angular/core';

// PrimeNG stuff
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

@NgModule({
  exports: [
    AccordionModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    ChipModule,
    DialogModule,
    DividerModule,
    FieldsetModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
    ImageModule,
    KeyFilterModule,
    ListboxModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    PasswordModule,
    SidebarModule,
    TableModule,
    TabViewModule,
    ToastModule,
    MenuModule,
    ScrollPanelModule,
  ],
})
export class PrimeNGModule {}
