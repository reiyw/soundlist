pub mod command;
pub mod core;
pub mod play;
pub mod sound;
pub mod sslang;
pub mod web;

#[macro_use]
extern crate derive_builder;
#[macro_use]
extern crate prettytable;

pub use crate::{
    command::{leave_based_on_voice_state_update, GENERAL_GROUP, OWNER_GROUP},
    core::{process_message, ChannelManager, GuildBroadcast, OpsMessage},
    play::{play_say_commands, SaySoundCache},
    sound::{SoundFile, SoundStorage},
    sslang::{SayCommand, SayCommands},
};
