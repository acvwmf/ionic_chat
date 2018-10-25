import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  username: string = '';
  message: string = '';
  messages: any = [];
  _chatSubscription;

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.username = this.navParams.get('username');

    this._chatSubscription = this.db.object('/chat').valueChanges().subscribe(data => {
      for(var key in data) {
        this.messages.push(data[key]);
      }
    });
  }

  sendMessage() {
    this.db.list('/chat').push({
      username: this.username,
      message: this.message
    }).then(() => {

    });
    this.message = '';
    this.messages = [];
  }

  ionViewWillLeave() {
    console.log('user is about to go');
    this._chatSubscription.unsubscribe();
    this.db.list('/chat').push({
      specialMessage: true,
      message: `${this.username} has left the room`
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.db.list('/chat').push({
      specialMessage: true,
      message: `${this.username} has joined the room`
    });
  }

}
