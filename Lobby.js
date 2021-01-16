import React from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import { connect } from "react-redux";
import { refreshcount, addtabledata } from "./Action";
import { Button } from "reactstrap";

function mapDispatchToProps(dispatch) {
  return {
    refreshcount: status => dispatch(refreshcount(status)),
    addtabledata: res => dispatch(addtabledata(res))
  };
}

function mapStateToProps(state) {
  return {
    refreshcountstatus: state.refreshcount,
    tabledata: state.data
  };
}

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedList: this.props.location.state.selectedList,
      firstset: [],
      secondset: [],
      rendom: 0,
      refreshresult: "false",
      status: "true",
      data: []
    };
  }

  shuffleArray = array => {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };

  refresh = () => {
    if (this.state.refreshresult == "false") {
      let min = 1;
      let max = 9;

      var randomno = Math.round(1 + Math.random() * (max - min));

      this.setState({
        refreshresult: "true",
        status: "false",
        rendom: randomno
      });

      this.props.refreshcount({ randomno });

      this.state.selectedList.map(dat => {
        if (dat.Bet == randomno) {
          [...this.state.selectedList],
            ((dat.winner = "true"),
            (dat.Price = dat.Price * 2),
            (dat.Win = dat.Win + 1));
        } else {
          [...this.state.selectedList],
            ((dat.winner = "false"), (dat.Loss = dat.Loss + 1));
        }
      });

      this.state.selectedList.map(selectvalue => {
        this.props.tabledata.filter(tabledat => {
          if (tabledat.Name == selectvalue.Name) {
            [...this.props.tabledata],
              ((tabledat.Win = selectvalue.Win),
              (tabledat.Loss = selectvalue.Loss),
              (tabledat.Price = selectvalue.Price));
          }
        });
        // [...res], ((dat.Win = 0), (dat.Loss = 0));
      });
    }
  };
  back = () => {
    // this.props.history.push("/");
    //performance.navigation.type;
    const res = JSON.parse(localStorage.getItem("tabledata"));

    localStorage.clear();
    localStorage.setItem("LOADED", "true");
    this.props.history.push({
      pathname: "/",
      state: { data: res, loader: "true" }
    });
  };

  componentDidMount() {
    if (!localStorage.getItem("tabledata")) {
      localStorage.setItem("tabledata", JSON.stringify(this.props.tabledata));
    }

    if (window.performance) {
      if (
        performance.navigation.type == 1 &&
        this.props.location.state.loader === undefined
      ) {
        if (!localStorage.getItem("firstLoad")) {
          let min = 1;
          let max = 9;

          var randomno = Math.round(1 + Math.random() * (max - min));

          localStorage.setItem("random", randomno);
          const res = JSON.parse(localStorage["tabledata"]);

          this.setState(
            {
              refreshresult: "true",
              status: "false",
              rendom: randomno,
              data: res
            },
            () => {
              console.log(this.state.data, "data");
            }
          );

          this.props.refreshcount({ randomno });

          this.state.selectedList.map(dat => {
            if (dat.Bet == randomno) {
              [...this.state.selectedList],
                ((dat.winner = "true"),
                (dat.Price = dat.Price * 2),
                (dat.Win = dat.Win + 1));
              this.setState({ refreshcount: "true" });
            } else {
              [...this.state.selectedList],
                ((dat.winner = "false"), (dat.Loss = dat.Loss + 1));
            }
          });

          this.state.selectedList.map(selectvalue => {
            res.filter(tabledat => {
              if (tabledat.Name == selectvalue.Name) {
                [...res],
                  ((tabledat.Win = selectvalue.Win),
                  (tabledat.Loss = selectvalue.Loss),
                  (tabledat.Price = selectvalue.Price));
              }
            });
          });

          localStorage.removeItem("tabledata");
          localStorage.setItem("tabledata", JSON.stringify(res));

          localStorage["firstLoad"] = "true";
          localStorage["status"] = "false";
        } else {
          if (localStorage.getItem("random")) {
            this.state.selectedList.map(dat => {
              if (dat.Bet == localStorage.getItem("random")) {
                [...this.state.selectedList],
                  ((dat.winner = "true"),
                  (dat.Price = dat.Price * 2),
                  (dat.Win = dat.Win + 1));
                this.setState({ refreshcount: "true" });
              } else {
                [...this.state.selectedList],
                  ((dat.winner = "false"), (dat.Loss = dat.Loss + 1));
              }
            });
            const res = JSON.parse(localStorage["tabledata"]);
            this.setState({
              rendom: localStorage.getItem("random"),
              status: localStorage.getItem("status"),
              data: res
            });

            this.state.selectedList.map(selectvalue => {
              res.filter(tabledat => {
                if (tabledat.Name == selectvalue.Name) {
                  [...res],
                    ((tabledat.Win = selectvalue.Win),
                    (tabledat.Loss = selectvalue.Loss),
                    (tabledat.Price = selectvalue.Price));
                }
              });
            });
            localStorage.removeItem("tabledata");
            localStorage.setItem("tabledata", JSON.stringify(res));
          }
        }
        // }
      } else if (this.props.location.state.loader == "true") {
        const loadvalue = this.props.location.state;

        const stateCopy = { ...loadvalue };
        delete stateCopy.loader;
        this.props.history.replace({ state: stateCopy });
      }
    }

    this.setState({
      firstset: this.state.firstset.concat(this.state.selectedList.slice(0, 5))
    });

    this.setState({
      secondset: this.state.secondset.concat(
        this.state.selectedList.slice(5, 9)
      )
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <h1 style={{ textAlign: "center" }}>Betting contestants</h1>
        <div className="row">
          {this.state.firstset.map((x, i) => (
            <div
              className="card  d-block ml-3"
              key={i}
              style={{
                align: "center",
                borderColor: "pink",
                backgroundColor: ""
              }}
            >
              <img
                src={x["Profile Image"]}
                alt="Avatar"
                style={{ width: 80, height: 80 }}
              />
              <div className="container">
                <div>
                  <b>Name:</b>
                  <span style={{ color: "blue" }}> {x.Name}</span>
                  <br />

                  <b>Bet:</b>
                  <span style={{ color: "blue" }}> {x.Bet}</span>
                  <br />

                  <b>Price:</b>
                  <span style={{ color: "blue" }}> ${x.Price}</span>
                  <br />
                </div>

                {x.winner === "true" && (
                  <div
                    style={{
                      color: "white",
                      backgroundColor: "green",
                      textAlign: "center"
                    }}
                  >
                    <b color="green">Winner</b>
                  </div>
                )}
                {x.winner === "false" && (
                  <div
                    style={{
                      color: "white",
                      backgroundColor: "red",
                      textAlign: "center"
                    }}
                  >
                    <b color="red">Losser</b>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 row">
          {localStorage.getItem("firstLoad") == "true" && (
            <div className="numberCircle col-md-1 offset-md-5">
              {this.state.rendom}
            </div>
          )}
        </div>

        <div className=" mt-3 row">
          {this.state.secondset.map((x, i) => (
            <div
              className="card mx-auto d-block"
              key={i}
              style={{
                align: "center",
                borderColor: "pink",
                backgroundColor: ""
              }}
            >
              <img
                src={x["Profile Image"]}
                alt="Avatar"
                style={{ width: 80, height: 80 }}
              />
              <div className="container">
                <div>
                  <b>Name:</b>
                  <span style={{ color: "blue" }}> {x.Name}</span>
                  <br />

                  <b>Bet:</b>
                  <span style={{ color: "blue" }}> {x.Bet}</span>
                  <br />

                  <b>Price:</b>
                  <span style={{ color: "blue" }}> ${x.Price}</span>
                  <br />
                </div>
                {x.winner === "true" && (
                  <div
                    style={{
                      color: "white",
                      backgroundColor: "green",
                      textAlign: "center"
                    }}
                  >
                    <b color="green">Winner</b>
                  </div>
                )}
                {x.winner === "false" && (
                  <div
                    style={{
                      color: "white",
                      backgroundColor: "red",
                      textAlign: "center"
                    }}
                  >
                    <b color="red">Losser</b>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          {this.state.status == "false" && (
            <Button align="center" color="danger" onClick={this.back}>
              Back
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const Form = connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);

export default withRouter(Form);
