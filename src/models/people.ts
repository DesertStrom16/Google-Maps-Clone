class People {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  dob: string;
  registered: string;
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  username: string;
  interest_ids: number[];

  constructor(
    gender: string,
    name: {
      title: string;
      first: string;
      last: string;
    },
    email: string,
    dob: string,
    registered: string,
    phone: string,
    cell: string,
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    },
    username: string,
    interest_ids: number[],
  ) {
    this.gender = gender;
    this.name = name;
    this.email = email;
    this.dob = dob;
    this.registered = registered;
    this.phone = phone;
    this.cell = cell;
    this.picture = picture;
    this.username = username;
    this.interest_ids = interest_ids;
  }
}

export default People;
