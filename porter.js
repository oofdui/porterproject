// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

//สร้างเทเบิ้ลชื่อ players ใส่ตัวแปรแบบ Global
//Players = new Mongo.Collection("players");
Porters=new Mongo.Collection("porters");

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return Porters.find({}, { sort: { patient: -1, name: 1 } });/*-1 = DESC , 1 = ASC*/
      /*หาเฉพาะที่ยังไม่ Complete เช่น .find({status:'pendding,porter_id:'mike'})*/
    },
    selectedName: function () {
      var porter = Porters.findOne(Session.get("selectedPlayer"));
      return porter && porter.name;
    }
  });

  Template.leaderboard.events({
    'click .inc': function () {
      var patientName=event.target.txtPatient.value
      //Porters.update(Session.get("selectedPlayer"), {$inc: {score: 5}});
      /*$inc คือ ฟังชันบน Mongo อาจหมายถึง บวกรวมเข้าไปอีก 5*/
      Porters.update(
        {_id:Session.get("selectedPlayer")},
        {
          $set:{patient:patientName}
        }
      );
    }
  });
  Template.leaderboard.events({
    "submit form": function(event, template) {
        var patientName=event.target.txtPatient.value
        Porters.update(
          {_id:Session.get("selectedPlayer")},
          {
            $set:{patient:patientName}
          }
        );
      }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selectedPlayer", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Porters.find().count() === 0) {
      var names = ["Nithi.re", "Pramuan.ja", "Supachai.pr",
                   "Somjit.jo", "Nopporn.jo", "Channarong.wo","Arnut.ku"];
      _.each(names, function (name) {
        Porters.insert({
          name: name,
          score: Math.floor(Random.fraction() * 10) * 5,
          patient:"- Free -"
        });
      });
    }
    else{
      //Porters.remove({});
    }
  });
}
