class PeopleBasic {
  name: {
    title: string;
    first: string;
    last: string;
  };
  username: string;

  thumbnail: string;

  constructor(
    name: {
      title: string;
      first: string;
      last: string;
    },
    username: string,
    thumbnail: string,
  ) {
    this.name = name;
    this.username = username;
    this.thumbnail = thumbnail;
  }
}

export default PeopleBasic;
