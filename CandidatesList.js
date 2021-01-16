import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import "./style.css";
import "./index.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addtabledata } from "./Action";

function mapDispatchToProps(dispatch) {
  return {
    addtabledata: res => dispatch(addtabledata(res))
  };
}

function mapStateToProps(state) {
  return { addtabledatavalue: state.data };
}

class CandidatesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: null,
      userListfilter:
        this.props.location.state != undefined
          ? this.props.location.state.data
          : [],
      userList:
        this.props.location.state != undefined
          ? this.props.location.state.data
          : [],
      selectedList: [],
      checked: false,
      count: 0
    };
  }

  componentDidMount() {
    if (this.state.userListfilter.length == 0) {
      fetch(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/bets7747a43.json"
      )
        .then(res => res.json())
        .then(res => {
          //this.setState({ userListfilter: res });

          res.map(dat => {
            [...res], ((dat.Win = 0), (dat.Loss = 0), (dat.Selected = "false"));
          });
          this.props.addtabledata({ res });
          this.setState({ userListfilter: res });
          this.setState({ userList: res });
        });
    } else {
      const res = this.props.location.state.data;
      this.props.addtabledata({ res });
    }
  }

  shuffleArray = array => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };

  MoreInfo = event => {
    const value = event.currentTarget.attributes["def"].value;

    this.setState(prevState => ({
      selectedList: [...prevState.selectedList, JSON.parse(value)]
    }));
  };

  changehandler = event => {
    const filterdat = this.state.userList.filter(dat => {
      return dat.Name.toLowerCase().includes(event.target.value.toLowerCase());
    });

    this.setState({ userListfilter: filterdat });
  };

  handleClick = () => {
    var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var arr1 = this.shuffleArray(array);

    this.state.selectedList.map((data, index) => {
      [((data["RandomNo"] = arr1[index]), (data["winner"] = ""))];
    });

    if (this.props.location.state == undefined) {
      localStorage.clear();
      this.props.history.push({
        pathname: "/nex",
        state: { selectedList: this.state.selectedList }
      });
    } else {
      const stateCopy = {
        ...this.props.location.state,
        selectedList: this.state.selectedList
      };

      this.props.history.push({
        pathname: "/nex",
        state: stateCopy
      });
    }
  };

  myClick = event => {
    const clickvalue = event.target.value;
    if (event.target.checked) {
      const value = event.currentTarget.attributes["def"].value;

      this.setState(prevState => ({
        selectedList: [...prevState.selectedList, JSON.parse(value)]
      }));
      this.setState(prevState => ({ count: prevState.count + 1 }));
    } else {
      const value = JSON.parse(event.currentTarget.attributes["def"].value);

      this.setState({
        selectedList: this.state.selectedList.filter(function(person) {
          return person.Name !== value.Name;
        })
      });
      this.setState(prevState => ({ count: prevState.count - 1 }));
    }
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="title" color="inherit">
                    Playing 9
                  </Typography>
                  <div style={{ flex: "1 1 0px" }} />
                </Toolbar>
              </AppBar>

              <ul className="list-group">
                {this.state.selectedList.map((item, i) => {
                  return (
                    <li
                      key={i}
                      className="list-group-item"
                      style={{ backgroundColor: "lightgrey" }}
                    >
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-lg-2">
                            <img
                              src={item["Profile Image"]}
                              width="30"
                              height="30"
                            />
                          </div>
                          <div className="col-lg-9">
                            <div>Name:{item.Name}</div>
                            <div>Price:{item.Price}</div>
                            <div>
                              Bet:
                              {item.Bet}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {this.state.count == 9 && (
                <div align="center">
                  <Button
                    align="center"
                    color="danger"
                    style={{ width: 150 }}
                    onClick={this.handleClick}
                  >
                    Start
                  </Button>
                </div>
              )}
            </div>
            <div className="col-lg-9" style={{ marginTop: 30 }}>
              <div className="container App">
                <h4 className="d-inline-block">
                  Selected Players -{this.state.count}
                </h4>
                <div className="clearfix" />{" "}
                <table
                  id="example1"
                  className="table table-bordered table-striped"
                >
                  <thead className="thead-dark">
                    <tr>
                      <th>Select</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Price</th>
                      <th>Bet</th>
                      <th>Win</th>
                      <th>Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.userListfilter.map((x, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="checkbox"
                            def={JSON.stringify(x)}
                            onClick={e => this.myClick(e)}
                          />
                        </td>
                        <td>{x.Name}</td>
                        <td>
                          <img
                            src={x["Profile Image"]}
                            width="20"
                            height="20"
                          />
                        </td>
                        <td>{x.Price}</td>
                        <td>{x.Bet}</td>
                        <td>{x.Win}</td>
                        <td>{x.Loss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Candidates = connect(
  mapStateToProps,
  mapDispatchToProps
)(CandidatesList);

export default withRouter(Candidates);
